import { transform } from 'sucrase'
// @ts-expect-error
import hashId from 'hash-sum'
import type { File, fileStore } from '../store/file'
export async function transformTS(src: string) {
  return transform(src, {
    transforms: ['typescript'],
  }).code
}
export const COMP_IDENTIFIER = '__sfc__'

export async function compileVue(
  ctx: any,
  file: File,
  compiler: Record<string, any>,
  option: Record<string, any>) {
  const { errors, descriptor } = compiler['@vue/compiler-sfc'].parse(file.code, {
    filename: file.filename,
    sourceMap: true,
  })
  if (errors.length) {
    ctx.errors = errors
    return
  }

  if (
    descriptor.styles.some((s: { lang: string }) => s.lang)
    || (descriptor.template && descriptor.template.lang)
  ) {
    ctx.errors = [
      'lang="x" pre-processors for <template> or <style> are currently not '
      + 'supported.',
    ]
    return
  }

  const id = hashId(file.filename)
  const scriptLang
    = (descriptor.script && descriptor.script.lang)
    || (descriptor.scriptSetup && descriptor.scriptSetup.lang)
  const isTS = scriptLang === 'ts'
  if (scriptLang && !isTS) {
    ctx.errors = ['Only lang="ts" is supported for <script> blocks.']
    return
  }

  const hasScoped = descriptor.styles.some((s: { scoped: string }) => s.scoped)
  let clientCode = ''
  let ssrCode = ''

  const appendSharedCode = (code: string) => {
    clientCode += code
    ssrCode += code
  }

  const clientScriptResult = await doCompileVueScript(
    ctx,
    descriptor,
    id,
    false,
    isTS,
    compiler['@vue/compiler-sfc'],
    option,
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
      option,
    )
    if (ssrScriptResult)
      ssrCode += ssrScriptResult[0]
    else
      ssrCode = `/* SSR compile error: ${ctx.errors[0]} */`
  }
  else {
    // when no <script setup> is used, the script result will be identical.
    ssrCode += clientScript
  }
  file.compiled.js = clientCode
  file.compiled.ssr = ssrCode

  // template
  // only need dedicated compilation if not using <script setup>
  if (
    descriptor.template
    && (!descriptor.scriptSetup || option?.script?.inlineTemplate === false)
  ) {
    const clientTemplateResult = await doCompileVueTemplate(
      ctx,
      descriptor,
      id,
      bindings,
      false,
      isTS,
      compiler['@vue/compiler-sfc'],
      option,
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
      option,
    )
    if (ssrTemplateResult) {
      // ssr compile failure is fine
      ssrCode += ssrTemplateResult
    }
    else {
      ssrCode = `/* SSR compile error: ${ctx.errors[0]} */`
    }
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
  let css = ''
  for (const style of descriptor.styles) {
    if (style.module) {
      ctx.errors[0] = [
        '<style module> is not supported in the playground.',
      ]
      return
    }

    const styleResult = await compiler['@vue/compiler-sfc'].compileStyleAsync({
      ...option?.style,
      source: style.content,
      filename: file.filename,
      id,
      scoped: style.scoped,
      modules: !!style.module,
    })
    if (styleResult.errors.length) {
      // postcss uses pathToFileURL which isn't polyfilled in the browser
      // ignore these errors for now
      if (!styleResult.errors[0].message.includes('pathToFileURL'))
        ctx.errors[0] = styleResult.errors

      // proceed even if css compile errors
    }
    else {
      css += `${styleResult.code}\n`
    }
  }
  if (css)
    file.compiled.css = css.trim()
  else
    file.compiled.css = '/* No <style> tags present */'

  // clear errors
  ctx.errors = []

  return file
}

async function doCompileVueScript(
  ctx: typeof fileStore,
  descriptor: any,
  id: string,
  ssr: boolean,
  isTS: boolean,
  compiler: any,
  options: Record<string, any>,
): Promise<[string, any] | undefined> {
  if (descriptor.script || descriptor.scriptSetup) {
    try {
      const expressionPlugins = isTS
        ? ['typescript']
        : undefined
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
      let code = ''
      if (compiledScript.bindings) {
        code += `\n/!* Analyzed bindings: ${JSON.stringify(
          compiledScript.bindings,
          null,
          2,
        )} *!/`
      }
      code
        += `\n${
         compiler.rewriteDefault(
          compiledScript.content,
          COMP_IDENTIFIER,
          expressionPlugins,
        )}`

      if ((descriptor.script || descriptor.scriptSetup)!.lang === 'ts')
        code = await transformTS(code)

      return [code, compiledScript.bindings]
    }
    catch (e: any) {
      ctx.errors = [e.stack.split('\n').slice(0, 12).join('\n')]
    }
  }
  else {
    return [`\nconst ${COMP_IDENTIFIER} = {}`, undefined]
  }
}

async function doCompileVueTemplate(
  ctx: typeof fileStore,
  descriptor: any,
  id: string,
  bindingMetadata: unknown,
  ssr: boolean,
  isTS: boolean,
  compiler: any,
  options: Record<string, any>,
) {
  const templateResult = compiler.compileTemplate({
    ...options?.template,
    source: descriptor.template!.content,
    filename: descriptor.filename,
    id,
    scoped: descriptor.styles.somesome((s: { scoped: string }) => s.scoped),
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
  if (templateResult.errors.length) {
    ctx.errors = templateResult.errors
    return
  }

  const fnName = ssr ? 'ssrRender' : 'render'

  let code
    = `\n${templateResult.code.replace(
      /\nexport (function|const) (render|ssrRender)/,
      `$1 ${fnName}`,
    )}` + `\n${COMP_IDENTIFIER}.${fnName} = ${fnName}`

  if ((descriptor.script || descriptor.scriptSetup)?.lang === 'ts')
    code = await transformTS(code)

  return code
}
