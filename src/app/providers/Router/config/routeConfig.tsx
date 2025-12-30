import { Navigate, type RouteObject } from 'react-router-dom'

// Layouts
import { RootLayout } from '@/shared/layouts/RootLayout'
import { WebAppLayout } from '@/shared/layouts/WebAppLayout'
import { PartnerLayout } from '@/shared/layouts/MainLayout'
import { SuperadminLayout } from '@/shared/layouts/SuperadminLayout'
import { OrderLayout } from '@/shared/layouts/OrderLayout'

// Guards
import { ProtectedRoute } from '../guards/ProtectedRoute'
import { UserRole } from '@/shared/types/router'
import { getRouteProfile, getRouteWebApp } from '@/shared/constants/router'

// Pages
import { TestAuthPage } from '@/pages/TestAuth'

// ============================================================================
// Temporary Page Components (пока не созданы реальные страницы)
// ============================================================================

// eslint-disable-next-line react-refresh/only-export-components
const TempPage = ({ title }: { title: string }) => (
  <div style={{ padding: '20px' }}>
    <h1>{title}</h1>
    <p>This is a temporary placeholder page</p>
  </div>
)

/**
 * Конфигурация роутов приложения
 * Использует вложенные роуты (Nested Routes) и Layout-компоненты
 *
 * Структура:
 * - Root Level (/)
 *   - WebApp Level (/webapp)
 *     - Superadmin Section (/webapp/superadmin) - Protected by SUPERADMIN role
 *     - Partner Section (/webapp/partner) - Protected by PARTNER role
 *     - Order Section (/webapp/order) - Protected by auth
 *     - Public pages
 *
 * Каждый уровень использует свой Layout с <Outlet /> для рендеринга дочерних роутов
 */
export const routeConfig: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // ========================================================================
      // PUBLIC ROUTES (/)
      // ========================================================================
      {
        index: true,
        element: <TempPage title="Main Page" />,
      },
      {
        path: 'test-auth',
        element: <TestAuthPage />,
      },

      // ========================================================================
      // WEBAPP SECTION (/webapp)
      // ========================================================================
      {
        path: getRouteWebApp(),
        element: <WebAppLayout />,
        children: [
          // WebApp Home
          {
            index: true,
            element: <TempPage title="WebApp Home" />,
          },

          // Public WebApp pages
          {
            path: getRouteProfile(),
            element: <TempPage title="Profile" />,
          },
          {
            path: 'privacy-policy',
            element: <TempPage title="Privacy Policy" />,
          },
          {
            path: 'public-offer',
            element: <TempPage title="Public Offer" />,
          },
          {
            path: 'fallback',
            element: <TempPage title="Fallback" />,
          },
          {
            path: 'tops',
            element: <TempPage title="Top Groups" />,
          },

          // ====================================================================
          // SUPERADMIN SECTION (/webapp/superadmin)
          // Protected by SUPERADMIN role
          // ====================================================================
          {
            path: 'superadmin',
            element: <ProtectedRoute roles={[UserRole.SUPERADMIN]} />,
            children: [
              {
                element: <SuperadminLayout />,
                children: [
                  {
                    index: true,
                    element: <TempPage title="Superadmin Home" />,
                  },
                  {
                    path: 'shops',
                    element: <TempPage title="Superadmin Shops" />,
                  },
                  {
                    path: 'create',
                    element: <TempPage title="Superadmin Create" />,
                  },
                  {
                    path: 'takeover',
                    element: <TempPage title="Superadmin Takeover" />,
                  },
                ],
              },
            ],
          },

          // ====================================================================
          // PARTNER SECTION (/webapp/partner)
          // Protected by PARTNER role
          // ====================================================================
          {
            path: 'partner',
            element: <ProtectedRoute roles={[UserRole.PARTNER]} />,
            children: [
              {
                element: <PartnerLayout />,
                children: [
                  {
                    index: true,
                    element: <TempPage title="Partner Home" />,
                  },
                  {
                    path: 'create',
                    element: <TempPage title="Partner Create" />,
                  },
                  {
                    path: 'menu',
                    children: [
                      {
                        path: 'form',
                        element: <TempPage title="Partner Menu Form" />,
                      },
                      {
                        path: 'modifier',
                        element: <TempPage title="Partner Menu Modifier" />,
                      },
                      {
                        path: 'list',
                        element: <TempPage title="Partner Menu List" />,
                      },
                    ],
                  },
                  {
                    path: 'report',
                    element: <TempPage title="Partner Report" />,
                  },
                  {
                    path: 'iiko',
                    element: <TempPage title="Partner Iiko" />,
                  },
                ],
              },
            ],
          },

          // ====================================================================
          // ORDER SECTION (/webapp/order)
          // Protected by auth (any authenticated user)
          // ====================================================================
          {
            path: 'order',
            element: <ProtectedRoute />,
            children: [
              {
                element: <OrderLayout />,
                children: [
                  {
                    index: true,
                    element: <TempPage title="Order Root" />,
                  },
                  {
                    path: 'shops',
                    element: <TempPage title="Order Shops" />,
                  },
                  {
                    path: 'menu',
                    element: <TempPage title="Order Menu" />,
                  },
                  {
                    path: 'checkout',
                    element: <TempPage title="Order Checkout" />,
                  },
                ],
              },
            ],
          },
        ],
      },

      // ========================================================================
      // FALLBACK ROUTES
      // ========================================================================
      {
        path: '404',
        element: <TempPage title="404 - Not Found" />,
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]
