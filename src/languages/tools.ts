import type { LangList, Recordable } from './type'

const langModules = import.meta.glob('./lang/*/index.ts', { eager: true })
const langModuleMap = new Map<string, Object>()
export const langCode: string[] = []
export const langKey: string = 'yoi-lang'

/**
 * 生成语言模块列表
 */
const generateLangModuleMap = () => {
  console.log('生成语言模块列表')
  const fullPaths = Object.keys(langModules)
  fullPaths.forEach(fullPath => {
    const moduleName = fullPath.split('/').slice(-2)[0]
    langCode.push(moduleName)
    langModuleMap.set(moduleName, (langModules[fullPath] as any)?.default)
  })
}

/**
 * 获取语言包
 * @returns 语言包
 */
export const importMessages = () => {
  generateLangModuleMap()
  const message: Recordable = {}
  langModuleMap.forEach((value: any, key) => {
    message[key] = value
  })
  return message
}

/**
 * 语言列表
 * @returns langList
 */
export const langList = () => {
  if (langModuleMap.size === 0) generateLangModuleMap()
  const list: LangList[] = []
  langModuleMap.forEach((value: any, key) => {
    list.push({
      content: value.lang,
      value: key,
    })
  })
  return list
}

/**
 * 获取浏览器默认语言
 */
export const getBrowserLang = () => {
  const browserLang = navigator.language
  let locales = browserLang.toLowerCase()
  if (locales.includes('zh')) return 'zh_CN'
  else if (locales.includes('en')) return 'en_US'
  return 'zh_CN'
}
