import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import AnimatedButton from '../components/AnimatedButton';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartItemCount,
    cartTotalPrice
  } = useCart();

  // Animation variants
  const pageVariants = { initial: { opacity: 0 }, in: { opacity: 1 }, out: { opacity: 0 } };
  const pageTransition = { duration: 0.4 };
  const itemVariants = { 
      initial: { opacity: 0, x: -20 }, 
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-[calc(100vh-10rem)] bg-gradient-to-br from-gray-50 to-gray-100 py-12 md:py-16"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
        >
            Shopping Cart
        </motion.h1>

        {cartItemCount === 0 ? (
          <motion.div 
            className="text-center bg-white p-10 rounded-lg shadow-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
            <AnimatedButton as={Link} to="/plant-store" variant="primary">
              Browse Plants
            </AnimatedButton>
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Cart Items List */}
            <ul role="list" className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <motion.li 
                    key={item.plant._id} 
                    className="flex flex-col sm:flex-row py-4 px-4 sm:px-6 items-center"
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    layout // Animate layout changes on remove
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-0 sm:mr-6">
                    <img
                      src={item.plant.image}
                      alt={item.plant.name}
                      className="w-full h-full rounded-md object-cover shadow"
                    />
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                    {/* Name & Price */}
                    <div className="flex-1 min-w-0 mb-4 sm:mb-0">
                      <h2 className="text-lg font-semibold text-gray-800">
                        <Link to={`/plants/${item.plant._id}`} className="hover:text-green-600">
                           {item.plant.name}
                        </Link>
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">${item.plant.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-300 rounded-md mx-4">
                      <button
                        onClick={() => updateQuantity(item.plant._id, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md focus:outline-none disabled:opacity-50"
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <MinusIcon className="h-4 w-4"/>
                      </button>
                      <span className="px-3 py-1 text-sm font-medium border-l border-r border-gray-300 w-10 text-center">
                          {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.plant._id, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md focus:outline-none"
                        aria-label="Increase quantity"
                      >
                        <PlusIcon className="h-4 w-4"/>
                      </button>
                    </div>
                    
                    {/* Item Total & Remove Button */}
                    <div className="flex items-center mt-4 sm:mt-0">
                        <p className="text-sm font-medium text-gray-900 w-20 text-right mr-4">
                            ${(item.plant.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                           onClick={() => removeFromCart(item.plant._id)}
                           className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                           aria-label="Remove item"
                         >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* Cart Summary & Actions */}
            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
              <div className="flex justify-between text-lg font-semibold text-gray-900 mb-4">
                <p>Subtotal</p>
                <p>${cartTotalPrice.toFixed(2)}</p>
              </div>
              {/* <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p> */} 
              <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
                <AnimatedButton 
                    onClick={clearCart}
                    variant="outlineSecondary"
                    size="sm"
                >
                  Clear Cart
                </AnimatedButton>
                <AnimatedButton 
                    onClick={() => toast.info('Checkout not implemented yet.')}
                    variant="primary"
                    size="sm"
                    className="w-full sm:w-auto"
                >
                  Proceed to Checkout
                </AnimatedButton>
              </div>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or{' '}
                  <Link to="/plant-store" className="font-medium text-green-600 hover:text-green-500">
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CartPage; 