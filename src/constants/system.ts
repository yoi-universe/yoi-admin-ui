// 菜单类型 [0:目录;1:菜单;2:按钮]
export const MENU_TYPE_DIRECTORY = 0
export const MENU_TYPE_MENU = 1
export const MENU_TYPE_BUTTON = 2

// 菜单是否为外链 [0:否;1:是]
export const MENU_NOT_LINK = 0
export const MENU_IS_LINK = 1

// 菜单状态 [0:正常;1:禁用]
export const MENU_STATUS_ENABLE = 0
export const MENU_STATUS_DISABLE = 1

// 菜单显示状态 [0:显示;1:隐藏]
export const MENU_SHOW_YES = 0
export const MENU_SHOW_NO = 1

// 连接打开方式 [0:内部;1:外部]
export const MENU_LINK_TARGET_SELF = 0
export const MENU_LINK_TARGET_BLANK = 1

/**
 * 菜单是否缓存
 * 0:缓存;1:不缓存
 */
export const MENU_CACHE_YES = 0
export const MENU_CACHE_NO = 1

/**
 * 顶部用户下拉菜单
 * 个人中心 profile
 * 退出登录 logout
 */
export const USER_DROP_DOWN_MENU_PROFILE = 'profile'
export const USER_DROP_DOWN_MENU_LOGOUT = 'logout'
