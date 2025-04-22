import type { Locale } from 'vue-i18n'
import type { UserModule } from '@/types'
import { createI18n } from 'vue-i18n'

// 获取浏览器默认语言
const getBrowserLanguage = (): string => {
  const lang = navigator.language || (navigator as any).userLanguage
  return lang.split('-')[0] // 只取主要语言代码
}

// 获取存储的语言设置
const getStoredLanguage = (): string => {
  return localStorage.getItem('moodshaker-language') || ''
}

// 设置默认语言
const defaultLocale = getStoredLanguage() || getBrowserLanguage() || 'en'

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {},
})

const localesMap = Object.fromEntries(
  Object.entries(import.meta.glob('../../locales/*.yml'))
    .map(([path, loadLocale]) => [path.match(/([\w-]*)\.yml$/)?.[1], loadLocale]),
) as Record<Locale, () => Promise<{ default: Record<string, string> }>>

export const availableLocales = Object.keys(localesMap)

const loadedLanguages: string[] = []

function setI18nLanguage(lang: Locale) {
  i18n.global.locale.value = lang as any
  if (typeof document !== 'undefined')
    document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

export async function loadLanguageAsync(lang: string): Promise<Locale> {
  // 如果语言相同，直接返回
  if (i18n.global.locale.value === lang)
    return setI18nLanguage(lang)

  // 如果语言已经加载过，直接切换
  if (loadedLanguages.includes(lang))
    return setI18nLanguage(lang)

  try {
    // 加载新的语言文件
    const messages = await localesMap[lang]()
    i18n.global.setLocaleMessage(lang, messages.default)
    loadedLanguages.push(lang)
    return setI18nLanguage(lang)
  } catch (error) {
    console.error(`Failed to load language: ${lang}`, error)
    return setI18nLanguage('en') // 加载失败时回退到英语
  }
}

export const install: UserModule = ({ app }) => {
  app.use(i18n)
  // 初始化时加载默认语言
  loadLanguageAsync(defaultLocale)
}
