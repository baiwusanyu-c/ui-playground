import { transform } from 'sucrase'
export async function compileTS(src: string) {
  return transform(src, {
    transforms: ['typescript'],
  }).code
}
