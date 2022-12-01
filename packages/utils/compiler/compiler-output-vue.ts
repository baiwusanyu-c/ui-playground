import hashId from 'hash-sum'
import { sendException } from '../index'
import { compileTS } from './compile-ts'
import type { File, fileStore } from '../../store/file'

export const COMP_IDENTIFIER = '__sfc__'

export async function compileVue(
  ctx: typeof fileStore,
  file: File,
  compiler: Record<string, any>,
  options: Record<string, any>) {
  // create the ast by file（.vue）
  const {
    descriptor,
    astSuccess,
    isTS,
  } = await doCreateSFCAST(file, compiler['@vue/compiler-sfc'])
  if (!astSuccess)
    return

  const id = hashId(file.filename)
  const hasScoped = descriptor.styles.some((s: { scoped: string }) => s.scoped)
  let clientCode = ''
  let ssrCode = ''

  //  compile <script> to csr
  const clientScriptResult = await doCompileVueScript(
    ctx,
    descriptor,
    id,
    false,
    isTS,
    compiler['@vue/compiler-sfc'],
    options,
  )
  if (!clientScriptResult)
    return
  const [clientScript, bindings] = clientScriptResult
  clientCode += clientScript

  // script ssr only needs to be performed if using <script setup> where
  // the render fn is inlined.
  if (descriptor.scriptSetup) {
    const ssrScriptResult = await doCompileVueScript(
      ctx,
      descriptor,
      id,
      true,
      isTS,
      compiler['@vue/compiler-sfc'],
      options,
    )
    if (ssrScriptResult) {
      ssrCode += ssrScriptResult[0]
    } else {
      ssrCode = '/* SSR compile error */'
      sendException(ssrCode, 'error')
    }
  } else {
    // when no <script setup> is used, the script result will be identical.
    ssrCode += clientScript
  }

  // template
  // only need dedicated compilation if not using <script setup>
  if (
    descriptor.template
    && (!descriptor.scriptSetup || options?.script?.inlineTemplate === false)
  ) {
    const clientTemplateResult = await doCompileVueTemplate(
      ctx,
      descriptor,
      id,
      bindings,
      false,
      isTS,
      compiler['@vue/compiler-sfc'],
      options,
    )
    if (!clientTemplateResult)
      return

    clientCode += clientTemplateResult

    const ssrTemplateResult = await doCompileVueTemplate(
      ctx,
      descriptor,
      id,
      bindings,
      true,
      isTS,
      compiler['@vue/compiler-sfc'],
      options,
    )
    if (ssrTemplateResult) {
      // ssr compile failure is fine
      ssrCode += ssrTemplateResult
    } else {
      ssrCode = '/* SSR compile error */'
      sendException(ssrCode, 'error')
    }
  }

  const appendSharedCode = (code: string) => {
    clientCode += code
    ssrCode += code
  }

  if (hasScoped) {
    appendSharedCode(
      `\n${COMP_IDENTIFIER}.__scopeId = ${JSON.stringify(`data-v-${id}`)}`,
    )
  }

  if (clientCode || ssrCode) {
    appendSharedCode(
      `\n${COMP_IDENTIFIER}.__file = ${JSON.stringify(file.filename)}`
      + `\nexport default ${COMP_IDENTIFIER}`,
    )
    file.compiled.js = clientCode.trimStart()
    file.compiled.ssr = ssrCode.trimStart()
  }

  // styles
  const [css, styleSuccess] = await doCompileSFCStyle(file, descriptor,
    id, compiler['@vue/compiler-sfc'], options)
  if (!styleSuccess)
    return

  file.compiled.css = css as string

  return file
}

async function doCreateSFCAST(
  file: File,
  compiler: Record<string, any>) {
  let astSuccess = true
  const { errors, descriptor } = compiler.parse(file.code, {
    filename: file.filename,
    sourceMap: true,
  })
  if (errors.length)
    astSuccess = false

  if (
    descriptor.styles.some((s: { lang: string }) => s.lang)
      || (descriptor.template && descriptor.template.lang)
  )
    astSuccess = false

  const scriptLang
      = (descriptor.script && descriptor.script.lang)
      || (descriptor.scriptSetup && descriptor.scriptSetup.lang)
  const isTS = scriptLang === 'ts'

  if (scriptLang && !isTS)
    astSuccess = false

  return {
    astSuccess,
    descriptor,
    isTS,
  }
}

async function doCompileVueScript(
  ctx: typeof fileStore,
  descriptor: Record<string, any>,
  id: string,
  ssr: boolean,
  isTS: boolean,
  compiler: Record<string, any>,
  options: Record<string, any>,
): Promise<[string, any] | undefined> {
  if (descriptor.script || descriptor.scriptSetup) {
    try {
      const expressionPlugins = isTS ? ['typescript'] : undefined
      const compiledScript = compiler.compileScript(descriptor, {
        inlineTemplate: true,
        ...options?.script,
        id,
        templateOptions: {
          ...options?.template,
          ssr,
          ssrCssVars: descriptor.cssVars,
          compilerOptions: {
            ...options?.template?.compilerOptions,
            expressionPlugins,
          },
        },
      })

      // <script setup>
      let code = ''
      if (compiledScript.bindings) {
        code += `\n/* Analyzed bindings: ${JSON.stringify(
          compiledScript.bindings,
          null,
          2,
        )} */`
      }
      code
        += `\n${
         compiler.rewriteDefault(
          compiledScript.content,
          COMP_IDENTIFIER,
          expressionPlugins,
        )}`

      if ((descriptor.script || descriptor.scriptSetup)!.lang === 'ts')
        code = await compileTS(code)

      return [code, compiledScript.bindings]
    } catch (e: any) {
      sendException((e as Error).message, 'error')
    }
  } else {
    return [`\nconst ${COMP_IDENTIFIER} = {}`, undefined]
  }
}

async function doCompileVueTemplate(
  ctx: typeof fileStore,
  descriptor: Record<string, any>,
  id: string,
  bindingMetadata: unknown,
  ssr: boolean,
  isTS: boolean,
  compiler: Record<string, any>,
  options: Record<string, any>,
) {
  const templateResult = compiler.compileTemplate({
    ...options?.template,
    source: descriptor.template!.content,
    filename: descriptor.filename,
    id,
    scoped: descriptor.styles.some((s: { scoped: string }) => s.scoped),
    slotted: descriptor.slotted,
    ssr,
    ssrCssVars: descriptor.cssVars,
    isProd: false,
    compilerOptions: {
      ...options?.template?.compilerOptions,
      bindingMetadata,
      expressionPlugins: isTS ? ['typescript'] : undefined,
    },
  })
  if (templateResult.errors.length)
    return

  const fnName = ssr ? 'ssrRender' : 'render'

  let code
    = `\n${templateResult.code.replace(
      /\nexport (function|const) (render|ssrRender)/,
      `$1 ${fnName}`,
    )}` + `\n${COMP_IDENTIFIER}.${fnName} = ${fnName}`

  if ((descriptor.script || descriptor.scriptSetup)?.lang === 'ts')
    code = await compileTS(code)

  return code
}

async function doCompileSFCStyle(
  file: File,
  descriptor: Record<string, any>,
  id: string,
  compiler: Record<string, any>,
  options: Record<string, any>,
) {
  let css = ''
  let astSuccess = true
  for (const style of descriptor.styles) {
    if (style.module)
      astSuccess = false

    const styleResult = await compiler.compileStyleAsync({
      ...options?.style,
      source: style.content,
      filename: file.filename,
      id,
      scoped: style.scoped,
      modules: !!style.module,
    })
    if (!styleResult.errors.length)
      css += `${styleResult.code}\n`
  }
  return [css, astSuccess]
}
