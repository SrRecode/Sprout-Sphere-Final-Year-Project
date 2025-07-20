import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Error Handling
import ErrorBoundary from '../components/ErrorBoundary';

// Layout Components
import RootLayout from '../layouts/RootLayout';

// Eagerly loaded components
import Home from '../pages/Home';
import PrivateRoute from '../components/PrivateRoute';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';

// Lazy loaded components
const AIPlantRecommendation = lazy(() => import('../components/AIPlantRecommendation'));
const AIPlantCareHub = lazy(() => import('../components/AIPlantCareHub'));
const PlantIdentificationWidget = lazy(() => import('../components/PlantIdentificationWidget'));
const PlantStore = lazy(() => import('../components/PlantStore'));
const CommunityHub = lazy(() => import('../components/EnhancedCommunityHub'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SignupPage = lazy(() => import('../pages/SignupPage'));
const UserProfile = lazy(() => import('../components/UserProfile'));
const CartPage = lazy(() => import('../pages/CartPage'));
const PlantDetailPage = lazy(() => import('../pages/PlantDetailPage'));
const PasswordResetPage = lazy(() => import('../pages/PasswordResetPage'));

// Lazy loaded footer pages
const AboutPage = lazy(() => import('../pages/FooterPages/AboutPage'));
const CareersPage = lazy(() => import('../pages/FooterPages/CareersPage'));
const BlogPage = lazy(() => import('../pages/FooterPages/BlogPage'));
const PressPage = lazy(() => import('../pages/FooterPages/PressPage'));
const HelpCenterPage = lazy(() => import('../pages/FooterPages/HelpCenterPage'));
const ContactPage = lazy(() => import('../pages/FooterPages/ContactPage'));
const FAQsPage = lazy(() => import('../pages/FooterPages/FAQsPage'));
const ShippingPage = lazy(() => import('../pages/FooterPages/ShippingPage'));
const GuidesPage = lazy(() => import('../pages/FooterPages/GuidesPage'));
const ForumPage = lazy(() => import('../pages/FooterPages/ForumPage'));
const DatabasePage = lazy(() => import('../pages/FooterPages/DatabasePage'));
const PrivacyPage = lazy(() => import('../pages/FooterPages/PrivacyPage'));
const TermsPage = lazy(() => import('../pages/FooterPages/TermsPage'));
const CookiesPage = lazy(() => import('../pages/FooterPages/CookiesPage'));
const PlaceholderPage = lazy(() => import('../pages/FooterPages/PlaceholderPage'));

// Lazy loaded admin pages
const AdminDashboard = lazy(() => import('../pages/AdminDashboard/AdminDashboard'));
const UsersManagement = lazy(() => import('../pages/AdminDashboard/UsersManagement'));
const PlantInventory = lazy(() => import('../pages/AdminDashboard/PlantInventory'));
const CommunityPosts = lazy(() => import('../pages/AdminDashboard/CommunityPosts'));
const Analytics = lazy(() => import('../pages/AdminDashboard/Analytics'));

// Test component
const ComprehensiveTestComponent = lazy(() => import('../components/ComprehensiveTestComponent'));
const ProductionTestComponent = lazy(() => import('../components/ProductionTestComponent'));

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

// Create router with future flags enabled
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <div className="min-h-screen flex items-center justify-center p-4 bg-red-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
        <p className="text-gray-700 mb-4">We're sorry, but there was an error loading this page. Please try again or contact support if the problem persists.</p>
        <button onClick={() => window.location.href = '/'} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Go back to homepage
        </button>
      </div>
    </div>,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "ai-recommendations",
        element: <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <AIPlantRecommendation />
          </Suspense>
        </ErrorBoundary>
      },
      {
        path: "ai-plant-care",
        element: <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <AIPlantCareHub />
          </Suspense>
        </ErrorBoundary>
      },
      {
        path: "plant-identifier",
        element: <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <PlantIdentificationWidget />
          </Suspense>
        </ErrorBoundary>
      },
      {
        path: "plant-store",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <PlantStore />
          </Suspense>
      },
      {
        path: "plants/:id",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <PlantDetailPage />
          </Suspense>,
        errorElement: <div className="p-8 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Plant Not Found</h2>
          <p className="text-gray-700 mb-4">Sorry, we couldn't find the plant you're looking for.</p>
          <button onClick={() => window.history.back()} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            Go Back
          </button>
        </div>
      },
      {
        path: "community-hub",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <CommunityHub />
          </Suspense>
      },
      
      {
        path: "login",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <LoginPage />
          </Suspense>
      },
      {
        path: "signup",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <SignupPage />
          </Suspense>
      },
      {
        path: "reset-password",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <PasswordResetPage />
          </Suspense>
      },
      {
        path: "reset-password/:token",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <PasswordResetPage />
          </Suspense>
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <UserProfile />
            </Suspense>
          </PrivateRoute>
        )
      },
      {
        path: "cart",
        element: (
          <PrivateRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <CartPage />
            </Suspense>
          </PrivateRoute>
        )
      },
      
      // Company Pages
      {
        path: "about",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <AboutPage />
          </Suspense>
      },
      {
        path: "careers",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <CareersPage />
          </Suspense>
      },
      {
        path: "blog",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <BlogPage />
          </Suspense>
      },
      {
        path: "press",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <PressPage />
          </Suspense>
      },
      
      // Support Pages
      {
        path: "help",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <HelpCenterPage />
          </Suspense>
      },
      {
        path: "contact",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <ContactPage />
          </Suspense>
      },
      {
        path: "faqs",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <FAQsPage />
          </Suspense>
      },
      {
        path: "shipping",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <ShippingPage />
          </Suspense>
      },
      
      // Resources Pages
      {
        path: "guides",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <GuidesPage />
          </Suspense>
      },
      {
        path: "forum",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <ForumPage />
          </Suspense>
      },
      {
        path: "database",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <DatabasePage />
          </Suspense>
      },
      {
        path: "expert-advice",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <PlaceholderPage 
              title="Expert Advice" 
              subtitle="Professional tips and insights for plant care"
              breadcrumbItems={[{ label: 'Expert Advice' }]}
            />
          </Suspense>
      },
      
      // Legal Pages
      {
        path: "privacy",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <PrivacyPage />
          </Suspense>
      },
      {
        path: "terms",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <TermsPage />
          </Suspense>
      },
      {
        path: "cookies",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <CookiesPage />
          </Suspense>
      },
      {
        path: "accessibility",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <PlaceholderPage 
              title="Accessibility" 
              subtitle="Our commitment to making SproutSphere accessible to everyone"
              breadcrumbItems={[{ label: 'Accessibility' }]}
            />
          </Suspense>
      },
      {
        path: "sitemap",
        element: 
          <Suspense fallback={<LoadingSpinner />}>
            <PlaceholderPage 
              title="Sitemap" 
              subtitle="Find your way around SproutSphere"
              breadcrumbItems={[{ label: 'Sitemap' }]}
            />
          </Suspense>
      },
      
      // Admin Routes
      {
        path: "admin",
        element: (
          <ProtectedAdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDashboard />
            </Suspense>
          </ProtectedAdminRoute>
        )
      },
      {
        path: "admin/users",
        element: (
          <ProtectedAdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <UsersManagement />
            </Suspense>
          </ProtectedAdminRoute>
        )
      },
      {
        path: "admin/plants",
        element: (
          <ProtectedAdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <PlantInventory />
            </Suspense>
          </ProtectedAdminRoute>
        )
      },
      {
        path: "admin/posts",
        element: (
          <ProtectedAdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <CommunityPosts />
            </Suspense>
          </ProtectedAdminRoute>
        )
      },
      {
        path: "admin/analytics",
        element: (
          <ProtectedAdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Analytics />
            </Suspense>
          </ProtectedAdminRoute>
        )
      },
      {
        path: "admin/orders",
        element: (
          <ProtectedAdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <PlaceholderPage 
                title="Orders & Sales" 
                subtitle="View orders, track sales, and manage fulfillment"
                breadcrumbItems={[{ label: 'Admin', path: '/admin' }, { label: 'Orders & Sales' }]}
              />
            </Suspense>
          </ProtectedAdminRoute>
        )
      },
      {
        path: "admin/chat",
        element: (
          <ProtectedAdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <PlaceholderPage 
                title="AI Chat Management" 
                subtitle="Monitor and manage AI chat interactions"
                breadcrumbItems={[{ label: 'Admin', path: '/admin' }, { label: 'AI Chat Management' }]}
              />
            </Suspense>
          </ProtectedAdminRoute>
        )
      },
      {
        path: "admin/content",
        element: (
          <ProtectedAdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <PlaceholderPage 
                title="Content Management" 
                subtitle="Manage blog posts, guides, and static content"
                breadcrumbItems={[{ label: 'Admin', path: '/admin' }, { label: 'Content Management' }]}
              />
            </Suspense>
          </ProtectedAdminRoute>
        )
      },
      {
        path: "admin/settings",
        element: (
          <ProtectedAdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <PlaceholderPage 
                title="System Settings" 
                subtitle="Configure system settings and preferences"
                breadcrumbItems={[{ label: 'Admin', path: '/admin' }, { label: 'System Settings' }]}
              />
            </Suspense>
          </ProtectedAdminRoute>
        )
      },
      {
        path: "test",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ComprehensiveTestComponent />
          </Suspense>
        )
      },
      {
        path: "production-test",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProductionTestComponent />
          </Suspense>
        )
      }
    ]
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
}); 