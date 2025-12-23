export enum AppRoutes {
  // root
  MAIN = 'main',

  // webapp
  WEBAPP_HOME = 'webapp_home',
  PROFILE = 'profile',
  PRIVACY_POLICY = 'privacy_policy',
  PUBLIC_OFFER = 'public_offer',
  FALLBACK = 'fallback',

  // superadmin
  SUPERADMIN_HOME = 'superadmin_home',
  SUPERADMIN_SHOPS = 'superadmin_shops',
  SUPERADMIN_CREATE = 'superadmin_create',
  SUPERADMIN_TAKEOVER = 'superadmin_takeover',

  // partner
  PARTNER_HOME = 'partner_home',
  PARTNER_CREATE = 'partner_create',
  PARTNER_MENU_FORM = 'partner_menu_form',
  PARTNER_MENU_MODIFIER = 'partner_menu_modifier',
  PARTNER_MENU_LIST = 'partner_menu_list',
  PARTNER_REPORT = 'partner_report',
  PARTNER_IIKO = 'partner_iiko',

  // order / user
  TOP_GROUPS = 'top_groups',

  ORDER_ROOT = 'order_root',
  ORDER_SHOPS = 'order_shops',
  ORDER_MENU = 'order_menu',
  ORDER_CHECKOUT = 'order_checkout',

  // system
  NOT_FOUND = 'not_found',
}

export const getRouteMain = () => '/'

/* webapp */
export const getRouteWebApp = () => '/webapp'
export const getRouteProfile = () => '/webapp/profile'
export const getRoutePrivacyPolicy = () => '/webapp/privacy-policy'
export const getRoutePublicOffer = () => '/webapp/public-offer'
export const getRouteFallback = () => '/webapp/fallback'

/* superadmin */
export const getRouteSuperadmin = () => '/webapp/superadmin'
export const getRouteSuperadminShops = () => '/webapp/superadmin/shops'
export const getRouteSuperadminCreate = () => '/webapp/superadmin/create'
export const getRouteSuperadminTakeover = () => '/webapp/superadmin/takeover'

/* partner */
export const getRoutePartner = () => '/webapp/partner'
export const getRoutePartnerCreate = () => '/webapp/partner/create'
export const getRoutePartnerMenuForm = () => '/webapp/partner/menu/form'
export const getRoutePartnerMenuModifier = () => '/webapp/partner/menu/modifier'
export const getRoutePartnerMenuList = () => '/webapp/partner/menu/list'
export const getRoutePartnerReport = () => '/webapp/partner/report'
export const getRoutePartnerIiko = () => '/webapp/partner/iiko'

/* user / order */
export const getRouteTopGroups = () => '/webapp/tops'

export const getRouteOrder = () => '/webapp/order'
export const getRouteOrderShops = () => '/webapp/order/shops'
export const getRouteOrderMenu = () => '/webapp/order/menu'
export const getRouteOrderCheckout = () => '/webapp/order/checkout'

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
  [getRouteMain()]: AppRoutes.MAIN,

  /* webapp */
  [getRouteWebApp()]: AppRoutes.WEBAPP_HOME,
  [getRouteProfile()]: AppRoutes.PROFILE,
  [getRoutePrivacyPolicy()]: AppRoutes.PRIVACY_POLICY,
  [getRoutePublicOffer()]: AppRoutes.PUBLIC_OFFER,
  [getRouteFallback()]: AppRoutes.FALLBACK,

  /* superadmin */
  [getRouteSuperadmin()]: AppRoutes.SUPERADMIN_HOME,
  [getRouteSuperadminShops()]: AppRoutes.SUPERADMIN_SHOPS,
  [getRouteSuperadminCreate()]: AppRoutes.SUPERADMIN_CREATE,
  [getRouteSuperadminTakeover()]: AppRoutes.SUPERADMIN_TAKEOVER,

  /* partner */
  [getRoutePartner()]: AppRoutes.PARTNER_HOME,
  [getRoutePartnerCreate()]: AppRoutes.PARTNER_CREATE,
  [getRoutePartnerMenuForm()]: AppRoutes.PARTNER_MENU_FORM,
  [getRoutePartnerMenuModifier()]: AppRoutes.PARTNER_MENU_MODIFIER,
  [getRoutePartnerMenuList()]: AppRoutes.PARTNER_MENU_LIST,
  [getRoutePartnerReport()]: AppRoutes.PARTNER_REPORT,
  [getRoutePartnerIiko()]: AppRoutes.PARTNER_IIKO,

  /* order */
  [getRouteTopGroups()]: AppRoutes.TOP_GROUPS,
  [getRouteOrder()]: AppRoutes.ORDER_ROOT,
  [getRouteOrderShops()]: AppRoutes.ORDER_SHOPS,
  [getRouteOrderMenu()]: AppRoutes.ORDER_MENU,
  [getRouteOrderCheckout()]: AppRoutes.ORDER_CHECKOUT,
}
