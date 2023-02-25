import defaultSettings from '@/settings'

const title = defaultSettings.title || '嘉晟CRM'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
