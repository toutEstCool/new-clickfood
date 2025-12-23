import {
  AppRoutes,
  getRouteMain,
  getRouteWebApp,
  getRouteSuperadmin,
  getRouteProfile,
  getRoutePrivacyPolicy,
  getRoutePublicOffer,
  getRouteFallback,
  getRouteSuperadminTakeover,
  getRouteSuperadminShops,
  getRouteSuperadminCreate,
  getRoutePartner,
  getRoutePartnerCreate,
  getRoutePartnerMenuForm,
  getRoutePartnerMenuModifier,
  getRoutePartnerMenuList,
  getRoutePartnerReport,
  getRoutePartnerIiko,
  getRouteOrder,
  getRouteOrderShops,
  getRouteOrderMenu,
  getRouteOrderCheckout,
  getRouteTopGroups,
} from '@/shared/constants/router'
import type { AppRoutesProps } from '@/shared/types/router'

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
  /* root */
  [AppRoutes.MAIN]: {
    path: getRouteMain(),
    element: <div>Main Page</div>,
  },

  /* webapp */
  [AppRoutes.WEBAPP_HOME]: {
    path: getRouteWebApp(),
    element: <div>WebApp Page</div>,
  },

  [AppRoutes.PROFILE]: {
    path: getRouteProfile(),
    element: <div>Profile Page</div>,
  },

  [AppRoutes.PRIVACY_POLICY]: {
    path: getRoutePrivacyPolicy(),
    element: <div>Privacy Policy Page</div>,
  },

  [AppRoutes.PUBLIC_OFFER]: {
    path: getRoutePublicOffer(),
    element: <div>Public Offer Page</div>,
  },

  [AppRoutes.FALLBACK]: {
    path: getRouteFallback(),
    element: <div>Fallback Page</div>,
  },

  /* superadmin */
  [AppRoutes.SUPERADMIN_HOME]: {
    path: getRouteSuperadmin(),
    element: <div>Superadmin Page</div>,
  },

  [AppRoutes.SUPERADMIN_SHOPS]: {
    path: getRouteSuperadminShops(),
    element: <div>Superadmin Shops Page</div>,
  },

  [AppRoutes.SUPERADMIN_CREATE]: {
    path: getRouteSuperadminCreate(),
    element: <div>Superadmin Create Page</div>,
  },

  [AppRoutes.SUPERADMIN_TAKEOVER]: {
    path: getRouteSuperadminTakeover(),
    element: <div>Superadmin Takeover Page</div>,
  },

  /* partner */
  [AppRoutes.PARTNER_HOME]: {
    path: getRoutePartner(),
    element: <div>Partner Page</div>,
  },

  [AppRoutes.PARTNER_CREATE]: {
    path: getRoutePartnerCreate(),
    element: <div>Partner Create Page</div>,
  },

  [AppRoutes.PARTNER_MENU_FORM]: {
    path: getRoutePartnerMenuForm(),
    element: <div>Partner Menu Form Page</div>,
  },

  [AppRoutes.PARTNER_MENU_MODIFIER]: {
    path: getRoutePartnerMenuModifier(),
    element: <div>Partner Menu Modifier Page</div>,
  },

  [AppRoutes.PARTNER_MENU_LIST]: {
    path: getRoutePartnerMenuList(),
    element: <div>Partner Menu List Page</div>,
  },

  [AppRoutes.PARTNER_REPORT]: {
    path: getRoutePartnerReport(),
    element: <div>Partner Report Page</div>,
  },

  [AppRoutes.PARTNER_IIKO]: {
    path: getRoutePartnerIiko(),
    element: <div>Partner Iiko Page</div>,
  },

  /* user / order */
  [AppRoutes.TOP_GROUPS]: {
    path: getRouteTopGroups(),
    element: <div>Top Groups Page</div>,
  },

  [AppRoutes.ORDER_ROOT]: {
    path: getRouteOrder(),
    element: <div>Order Page</div>,
  },

  [AppRoutes.ORDER_SHOPS]: {
    path: getRouteOrderShops(),
    element: <div>Order Shops Page</div>,
  },

  [AppRoutes.ORDER_MENU]: {
    path: getRouteOrderMenu(),
    element: <div>Order Menu Page</div>,
  },

  [AppRoutes.ORDER_CHECKOUT]: {
    path: getRouteOrderCheckout(),
    element: <div>Order Checkout Page</div>,
  },

  /* system */
  [AppRoutes.NOT_FOUND]: {
    path: '*',
    element: <div>Not Found Page</div>,
  },
}
