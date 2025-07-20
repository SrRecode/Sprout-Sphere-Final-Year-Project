import React, { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedButton from './AnimatedButton'
import AnimatedCard from './AnimatedCard'
import AnimatedSection from './AnimatedSection'
import {
  Search, 
  MessageSquare, 
  Eye,
  PenSquare,
  ArrowUp,
  MessageCircle,
  Calendar,
  Users,
  Filter
} from 'lucide-react'
import { postService } from '../services/postService'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const categories = [
  { id: 1, name: 'Indoor Plants', count: 156 },
  { id: 2, name: 'Outdoor Gardening', count: 243 },
  { id: 3, name: 'Vegetable Gardening', count: 189 },
  { id: 4, name: 'Plant Health', count: 167 },
  { id: 5, name: 'Propagation', count: 98 },
  { id: 6, name: 'Tools & Equipment', count: 75 },
]

const CommunityHub = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newPostContent, setNewPostContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const { isAuthenticated, user } = useAuth()

  const itemVariants = { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { opacity: 1, y: 0 } 
  };

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)
      const res = await postService.getAllPosts();
      if (res.success) {
        setPosts(res.data)
      } else {
        setError(res.message)
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  // Handle New Post Submission
  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPostContent.trim()) {
      toast.warn('Post content cannot be empty.')
      return
    }
    if (!isAuthenticated) {
      toast.error('You must be logged in to create a post.')
      return
    }
    
    setIsPosting(true)
    const res = await postService.createPost({ 
      title: `Post by ${user?.name || 'User'} on ${new Date().toLocaleDateString()}`,
      content: newPostContent 
    });
    if (res.success) {
      setPosts([res.data, ...posts])
      setNewPostContent('')
      toast.success('Post created successfully!')
    }
    setIsPosting(false)
  }
  
  // Handle Like Post
  const handleLikePost = async (postId) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to like posts.')
      return
    }
    const res = await postService.likePost(postId);
    if (res.success) {
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data.likes } : p))
      toast.success('Post liked!')
    }
  }
  
  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric' 
      })
    } catch (e) { return 'Invalid Date' }
  }

  return (
    <AnimatedSection className="min-h-[calc(100vh-10rem)] bg-gray-50 dark:bg-dark-800/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-primary-gradient rounded-full shadow-lg mb-6">
            <MessageSquare className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-4">
            Community <span className="text-primary-gradient">Hub</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect, share, and learn with fellow plant enthusiasts from around the globe.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
          {/* Sidebar */} 
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            {/* Create Post Button/Section */}
            <div className="bg-white dark:bg-dark-800/80 rounded-xl shadow-md p-4 mb-6 border border-gray-100 dark:border-gray-700">
              {isAuthenticated ? (
                <form onSubmit={handleCreatePost}>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your thoughts or ask a question..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white rounded-lg focus:ring-primary-500 focus:border-primary-500 min-h-[120px]"
                  ></textarea>
                  <div className="mt-3">
                    <AnimatedButton 
                      type="submit"
                      variant="primary" 
                      className="w-full bg-primary-gradient"
                      icon={PenSquare}
                      disabled={isPosting}
                    >
                      {isPosting ? 'Posting...' : 'Create Post'}
                    </AnimatedButton>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4">
                  <Users className="h-10 w-10 mx-auto mb-2 text-primary-400" />
                  <h3 className="text-gray-900 dark:text-white font-medium mb-2">Join the conversation</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Sign in to post and interact with the community</p>
                  <div className="flex gap-3 justify-center">
                    <AnimatedButton 
                      as={Link} 
                      to="/login" 
                      variant="outlinePrimary"
                      size="sm"
                    >
                      Login
                    </AnimatedButton>
                    <AnimatedButton 
                      as={Link} 
                      to="/signup" 
                      variant="primary"
                      className="bg-primary-gradient"
                      size="sm"
                    >
                      Sign Up
                    </AnimatedButton>
                  </div>
                </div>
              )}
            </div>

            {/* Categories Section */}
            <div className="bg-white dark:bg-dark-800/80 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-primary-400" />
                  Categories
                </h3>
              </div>
              <div className="p-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === 'All' 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  All Topics
                </button>
                
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                      selectedCategory === category.name 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full px-2 py-0.5">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Posts Feed */}
          <div className="lg:col-span-3">
            {/* Search & Sort Options */}
            <div className="bg-white dark:bg-dark-800/80 rounded-xl shadow-md p-4 mb-6 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search posts..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white py-2 pl-3 pr-10 text-sm focus:ring-primary-500 focus:border-primary-500 md:w-40"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="active">Most Active</option>
              </select>
            </div>

            {/* Posts Display */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12 bg-white dark:bg-dark-800/80 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-400 border-t-transparent mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">Loading community posts...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl shadow-md border border-red-100 dark:border-red-800/50">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                  <AnimatedButton 
                    onClick={() => window.location.reload()} 
                    variant="primary"
                    className="mt-4 bg-red-600 hover:bg-red-700 border-transparent"
                  >
                    Try Again
                  </AnimatedButton>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-dark-800/80 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Be the first to start a conversation!</p>
                  {isAuthenticated ? (
                    <p className="text-primary-600 dark:text-primary-400">Share your thoughts in the post form to the left.</p>
                  ) : (
                    <AnimatedButton 
                      as={Link} 
                      to="/login" 
                      variant="primary"
                      className="bg-primary-gradient"
                    >
                      Login to Post
                    </AnimatedButton>
                  )}
                </div>
              ) : (
                <AnimatePresence>
                  {posts.map((post, index) => (
                    <motion.div 
                      key={post._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                    >
                      <AnimatedCard className="bg-white dark:bg-dark-800/80 overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="p-5">
                          {/* Author/Date info */}
                          <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                              <img 
                                src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name || 'User'}&background=4ADE80&color=fff`} 
                                alt={post.author?.name || 'User'}
                                className="h-10 w-10 rounded-full border-2 border-primary-100 dark:border-primary-900/50"
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {post.author?.name || 'Anonymous User'}
                              </p>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>{formatDate(post.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Post Content */}
                          <div className="mb-4">
                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                              {post.content}
                            </p>
                          </div>
                          
                          {/* Interaction Bar */}
                          <div className="flex items-center text-sm border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                            <button 
                              onClick={() => handleLikePost(post._id)}
                              className="flex items-center mr-4 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              <ArrowUp className="w-4 h-4 mr-1" />
                              <span>{post.likes || 0}</span>
                            </button>
                            <Link 
                              to={`/community/${post._id}`} 
                              className="flex items-center mr-4 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              <span>{post.comments?.length || 0} comments</span>
                            </Link>
                            <Link 
                              to={`/community/${post._id}`} 
                              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              <span>{post.views || 0} views</span>
                            </Link>
                          </div>
                        </div>
                      </AnimatedCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {/* Pagination/Load More (if needed) */}
              {posts.length > 0 && (
                <div className="text-center mt-6">
                  <AnimatedButton 
                    variant="outlinePrimary"
                    onClick={() => console.log('Loading more posts')} // Implement actual pagination
                  >
                    Load More
                  </AnimatedButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default CommunityHub