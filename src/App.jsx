import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './config/router.jsx'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Testimonials from './components/Testimonials'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import AIPlantRecommendation from './components/AIPlantRecommendation'
import PlantStore from './components/PlantStore'
import CommunityHub from './components/CommunityHub'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import UserProfile from './components/UserProfile'
import PrivateRoute from './components/PrivateRoute'
import CartPage from './pages/CartPage'
import PlantDetailPage from './pages/PlantDetailPage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { PlantCareProvider } from './context/PlantCareContext'
import { UserPreferencesProvider } from './context/UserPreferencesContext'
import ErrorBoundary from './components/ErrorBoundary'
import { useTheme } from './context/ThemeContext'

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <Newsletter />
    </>
  )
}

const App = () => {
  const { theme } = useTheme();
  
  return (
    <CartProvider>
      <WishlistProvider>
        <PlantCareProvider>
          <UserPreferencesProvider>
            <RouterProvider router={router} />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={theme === 'dark' ? 'dark' : 'light'}
            />
          </UserPreferencesProvider>
        </PlantCareProvider>
      </WishlistProvider>
    </CartProvider>
  );
};

export default App;
