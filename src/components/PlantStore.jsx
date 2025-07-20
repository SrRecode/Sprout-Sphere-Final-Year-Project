import React, { useState, useEffect, useRef } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { plantService } from '../services/plantService'
import { toast } from 'react-toastify'
import AnimatedCard from './AnimatedCard'
import AnimatedSection from './AnimatedSection'
import { Search, ShoppingCart, ChevronLeft, ChevronRight, Sparkles, Tag, Star, Filter, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import ResponsiveImage from './ResponsiveImage'

// List of reliable fallback images if needed
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800',
  'https://images.unsplash.com/photo-1637967965095-09c2d352c9b3?q=80&w=800',
  'https://images.unsplash.com/photo-1517191434949-5e90cd67d2b6?q=80&w=800',
  'https://images.unsplash.com/photo-1599598177991-ec67ee297ba3?q=80&w=800',
  'https://images.unsplash.com/photo-1592150621744-aca64f48388a?q=80&w=800'
];

const PlantStore = () => {
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedCareLevel, setSelectedCareLevel] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [plantsPerPage] = useState(12)
  const { addToCart } = useCart()
  const [featuredPlants, setFeaturedPlants] = useState([])
  const [filtersVisible, setFiltersVisible] = useState(false)
  const filterRef = useRef(null)

  const containerVariants = { 
    hidden: { opacity: 0 }, 
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } } 
  };
  
  const itemVariants = { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { opacity: 1, y: 0 } 
  };

  // Handle clicks outside the filter panel to close it on mobile
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target) && window.innerWidth < 768) {
        setFiltersVisible(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch plants from backend on component mount
  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await plantService.getAllPlants()
        if (response.success) {
          const allPlants = response.data;
          setPlants(allPlants)

          // Select some plants as featured
          const featured = allPlants
            .filter(plant => plant.inStock && plant.image)
            .sort(() => 0.5 - Math.random())
            .slice(0, 6);

          setFeaturedPlants(featured);
          console.log('Plants fetched successfully:', allPlants.length);
        } else {
          throw new Error(response.message || 'Failed to fetch plants')
        }
      } catch (err) {
        const errorMsg = err.message || 'Could not load plants'
        console.error("Fetch Plants Error:", errorMsg, err)
        setError(errorMsg)
        toast.error(`Error loading plants: ${errorMsg}`)
      } finally {
        setLoading(false)
      }
    }

    fetchPlants()
  }, [])

  // Basic filtering logic
  const filteredPlants = plants
    .filter(plant => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = (plant.name?.toLowerCase() || '').includes(lowerSearch) ||
                            (plant.scientificName?.toLowerCase() || '').includes(lowerSearch);
      const matchesCategory = selectedCategory === 'All' || plant.category === selectedCategory;
      const matchesCareLevel = selectedCareLevel === 'All' || plant.careLevel === selectedCareLevel;

      return matchesSearch && matchesCategory && matchesCareLevel;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      return 0;
    });

  // Get current plants for pagination
  const indexOfLastPlant = currentPage * plantsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
  const currentPlants = filteredPlants.slice(indexOfFirstPlant, indexOfLastPlant);
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle prev/next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: document.getElementById('plant-grid').offsetTop - 100, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: document.getElementById('plant-grid').offsetTop - 100, behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedCareLevel('All');
    setSearchTerm('');
    setSortBy('name');
    toast.info('All filters have been reset');
  };

  const handleAddToCart = (plant) => {
    if (!plant || !plant._id) {
      console.error("Invalid plant data passed to handleAddToCart", plant);
      toast.error("Cannot add item to cart.");
      return;
    }
    toast.success(`Added ${plant.name} to cart!`);
    addToCart(plant);
  }

  const getCareLevelColor = (level) => {
    switch (level) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Expert': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Get random fallback image
  const getRandomFallbackImage = () => {
    return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  };

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Show dots before current page group if needed
    if (currentPage > 4) {
      pageNumbers.push('...');
    }

    // Pages around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if current page is near the beginning
    if (currentPage <= 3) {
      endPage = Math.min(4, totalPages - 1);
    }

    // Adjust if current page is near the end
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Show dots before last page if needed
    if (totalPages > 5 && currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <AnimatedSection>
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Plant Store</h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
          Find the perfect green companion for your space
        </p>
      </AnimatedSection>

      {/* Featured Plants Section */}
      {featuredPlants.length > 0 && (
        <AnimatedSection>
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Sparkles className="w-5 h-5 text-amber-500 mr-2" />
              <h2 className="text-2xl font-bold">Featured Plants</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredPlants.map((plant) => (
                <AnimatedCard key={`featured-${plant._id}`} className="h-full">
                  <Link to={`/plants/${plant._id}`} className="block h-full">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                      <div className="relative h-48 sm:h-56">
                        <ResponsiveImage
                          src={plant.image || getRandomFallbackImage()}
                          alt={plant.name}
                          fallbackSrc={getRandomFallbackImage()}
                          className="w-full h-full"
                          objectFit="cover"
                        />
                        {plant.isNew && (
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            New
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <h3 className="font-bold text-lg mb-1">{plant.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
                          {plant.scientificName}
                        </p>
                        <div className="flex items-center mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getCareLevelColor(plant.careLevel)}`}>
                            {plant.careLevel || 'Moderate'}
                          </span>
                        </div>
                        <div className="mt-auto pt-2 flex items-center justify-between">
                          <span className="font-bold text-lg">${plant.price?.toFixed(2) || '19.99'}</span>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToCart(plant);
                            }}
                            aria-label={`Add ${plant.name} to cart`}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full transition-colors"
                          >
                            <ShoppingCart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Main store section */}
      <div className="mb-8">
        {/* Search bar - Full width on mobile */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            aria-label="Search plants"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
        </div>

        {/* Mobile filter toggle button */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleFilters}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-700"
          >
            <Filter className="w-5 h-5" />
            <span>{filtersVisible ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Hidden by default on mobile, toggled with button */}
          <div 
            ref={filterRef}
            className={`${
              filtersVisible ? 'block' : 'hidden'
            } md:block w-full md:w-64 lg:w-72 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 md:mb-0`}
          >
            <div className="flex items-center justify-between mb-4 md:hidden">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setFiltersVisible(false)} aria-label="Close filters">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold mb-2">Categories</h3>
              <div className="space-y-2">
                {['All', 'Indoor', 'Outdoor', 'Succulents', 'Tropical', 'Flowering', 'Herbs'].map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={`category-${category}`}
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor={`category-${category}`} className="ml-2 text-sm">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-2">Care Level</h3>
              <div className="space-y-2">
                {['All', 'Easy', 'Moderate', 'Expert'].map((level) => (
                  <div key={level} className="flex items-center">
                    <input
                      type="radio"
                      id={`care-${level}`}
                      name="careLevel"
                      checked={selectedCareLevel === level}
                      onChange={() => setSelectedCareLevel(level)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor={`care-${level}`} className="ml-2 text-sm">
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm transition-colors"
            >
              Reset Filters
            </button>
          </div>

          {/* Plant grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 text-sm underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
                    Showing <span className="font-medium">{currentPlants.length}</span> of{' '}
                    <span className="font-medium">{filteredPlants.length}</span> plants
                  </p>
                </div>

                {filteredPlants.length === 0 ? (
                  <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
                    <p className="text-lg mb-4">No plants match your filters</p>
                    <button
                      onClick={handleResetFilters}
                      className="py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <motion.div
                    id="plant-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {currentPlants.map((plant) => (
                      <motion.div key={plant._id} variants={itemVariants}>
                        <AnimatedCard className="h-full">
                          <Link to={`/plants/${plant._id}`} className="block h-full">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                              <div className="relative h-48 sm:h-56">
                                <ResponsiveImage
                                  src={plant.image || getRandomFallbackImage()}
                                  alt={plant.name}
                                  fallbackSrc={getRandomFallbackImage()}
                                  className="w-full h-full"
                                  objectFit="cover"
                                />
                                {!plant.inStock && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <span className="text-white font-bold px-3 py-1 bg-red-500 rounded-full">
                                      Out of Stock
                                    </span>
                                  </div>
                                )}
                                {plant.isNew && (
                                  <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    New
                                  </div>
                                )}
                                {plant.onSale && (
                                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                                    <Tag className="w-3 h-3 mr-1" />
                                    Sale
                                  </div>
                                )}
                              </div>
                              <div className="p-4 flex-grow flex flex-col">
                                <h3 className="font-bold text-lg mb-1">{plant.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
                                  {plant.scientificName}
                                </p>
                                <div className="flex items-center mb-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${getCareLevelColor(plant.careLevel)}`}>
                                    {plant.careLevel || 'Moderate'}
                                  </span>
                                </div>
                                <div className="mt-auto pt-2 flex items-center justify-between">
                                  <span className="font-bold text-lg">${plant.price?.toFixed(2) || '19.99'}</span>
                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleAddToCart(plant);
                                    }}
                                    disabled={!plant.inStock}
                                    aria-label={`Add ${plant.name} to cart`}
                                    className={`${
                                      plant.inStock 
                                        ? 'bg-emerald-500 hover:bg-emerald-600' 
                                        : 'bg-gray-400 cursor-not-allowed'
                                    } text-white p-2 rounded-full transition-colors`}
                                  >
                                    <ShoppingCart className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </AnimatedCard>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Pagination - Simplified for mobile */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                          currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="hidden sm:flex items-center space-x-1">
                        {getPageNumbers().map((number, index) => (
                          <button
                            key={`page-${index}`}
                            onClick={() => (number !== '...' ? paginate(number) : null)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${
                              number === currentPage
                                ? 'bg-emerald-500 text-white'
                                : number === '...'
                                ? 'text-gray-700 dark:text-gray-300 cursor-default'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                            disabled={number === '...'}
                          >
                            {number}
                          </button>
                        ))}
                      </div>
                      
                      {/* Mobile pagination indicator */}
                      <span className="sm:hidden px-4">
                        {currentPage} / {totalPages}
                      </span>
                      
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                          currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantStore