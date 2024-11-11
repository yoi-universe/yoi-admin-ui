import type { RouteMeta } from 'vue-router'

const title = import.meta.env.VITE_WEB_TITLE

function getPageTitle(data: string | RouteMeta): string {
  if (typeof data === 'string') {
    return `${data} - ${title}`
  } else {
    return `${data?.title || ''} - ${title}`
  }
}

export default getPageTitle
