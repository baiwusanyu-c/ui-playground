import { compare } from 'compare-versions'
import { sendException } from '../utils'
import type { headerOption } from '../utils/config'
// 'https://data.jsdelivr.com/v1/package/npm/vue'

function getVersionFromCDN(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
    }).then(async(res: any) => {
      resolve(await parseRes(res))
    }).catch(err => reject(err))
  })
}

async function parseRes(res: Response) {
  const contentType = res.headers.get('Content-Type')
  let resVal
  // 判定返回的内容类型，做不同的处理
  if (contentType) {
    if (contentType.includes('json'))
      resVal = await res.json()

    if (contentType.includes('text'))
      resVal = await res.text()

    if (contentType.includes('form'))
      resVal = await res.formData()

    if (contentType.includes('video'))
      resVal = await res.blob()
  } else {
    resVal = await res.text()
  }
  return resVal
}

export const versionStore = {
  uiVersion: '',
  uiVersionList: [] as Array<string>,
  uiMinVersion: '',
  uiVersionLink: '',
  libVersion: '',
  libVersionList: [] as Array<string>,
  libMinVersion: '',
  libVersionLink: '',

  init(config: headerOption): void {
    this.uiVersion = config.uiVersion || 'latest'
    this.uiMinVersion = config.uiMinVersion!
    this.uiVersionLink = config.uiVersionLink || 'latest'

    this.libVersion = config.libVersion || 'latest'
    this.libMinVersion = config.libMinVersion!
    this.libVersionLink = config.libVersionLink || 'latest'
  },

  setVersion(version: string, type: 'ui' | 'lib'): void {
    if (type === 'ui')
      this.uiVersion = version

    else
      this.libVersion = version
  },

  getVersion(type: 'ui' | 'lib') {
    const url = type === 'ui' ? this.uiVersionLink : this.libVersionLink
    return new Promise((resolve, reject) => {
      getVersionFromCDN(url).then((data: any) => {
        const res = this.comparedVersion(data.versions, type)
        if (type === 'ui')
          this.uiVersionList = res

        else
          this.libVersionList = res

        resolve(res)
      }).catch((error: Error) => {
        console.log(error)
        sendException(error.message, 'error')
        reject(error)
      })
    })
  },

  comparedVersion(version: Array<string>, type: 'ui' | 'lib'): Array<string> {
    const canUserVersions = version.filter((ver) => {
      return this[`${type}MinVersion`] ? compare(ver, this[`${type}MinVersion`], '>=') : true
    })
    if (canUserVersions.length > 0)
      canUserVersions.unshift('latest')

    return canUserVersions
  },
}
