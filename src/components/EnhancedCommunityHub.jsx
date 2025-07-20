import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  MoreHorizontal,
  Send,
  UserPlus,
  UserMinus,
  Bell,
  BellOff,
  Trash2,
  Edit,
  Reply,
  ThumbsUp,
  Users,
  Search,
  Filter,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { 
  followUser, 
  getUserProfile, 
  getNotifications, 
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  searchUsers
} from '../services/socialService';

const EnhancedCommunityHub = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('feed'); // feed, bookmarks, profile
  
  // Post creation state
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: [] });
  const [newTag, setNewTag] = useState('');
  
  // Comment state
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  const notificationsRef = useRef(null);

  useEffect(() => {
    fetchPosts();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postService.getAllPosts();
      if (response.success) {
        setPosts(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.data);
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await postService.createPost(newPost);
      if (response.success) {
        setPosts([response.data, ...posts]);
        setNewPost({ title: '', content: '', tags: [] });
        setShowCreatePost(false);
        toast.success('Post created successfully!');
      }
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await postService.likePost(postId);
      if (response.success) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, likes: response.data.likes, isLiked: response.data.isLiked }
            : post
        ));
      }
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleBookmarkPost = async (postId) => {
    try {
      const response = await postService.bookmarkPost(postId);
      if (response.success) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, bookmarks: response.data.bookmarks, isBookmarked: response.data.isBookmarked }
            : post
        ));
      }
    } catch (error) {
      toast.error('Failed to bookmark post');
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      const response = await postService.addComment(postId, commentText);
      if (response.success) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, comments: [...post.comments, response.data] }
            : post
        ));
        setCommentText('');
        toast.success('Comment added successfully!');
      }
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleAddReply = async (postId, commentId) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      const response = await postService.addReply(postId, commentId, replyText);
      if (response.success) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? {
                ...post,
                comments: post.comments.map(comment =>
                  comment._id === commentId
                    ? { ...comment, replies: [...comment.replies, response.data] }
                    : comment
                )
              }
            : post
        ));
        setReplyText('');
        setReplyingTo(null);
        toast.success('Reply added successfully!');
      }
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  const handleFollowUser = async (userId) => {
    try {
      const response = await followUser(userId);
      if (response.success) {
        setPosts(posts.map(post => 
          post.user._id === userId 
            ? { ...post, user: { ...post.user, isFollowing: response.data.isFollowing } }
            : post
        ));
        toast.success(response.data.isFollowing ? 'User followed!' : 'User unfollowed!');
      }
    } catch (error) {
      toast.error('Failed to follow user');
    }
  };

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await searchUsers(searchQuery);
      if (response.success) {
        setSearchResults(response.data);
        setShowUserSearch(true);
      }
    } catch (error) {
      toast.error('Failed to search users');
    }
  };

  const handleMarkNotificationAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(notification =>
        notification._id === notificationId
          ? { ...notification, isRead: true }
          : notification
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(notifications.filter(notification => notification._id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !newPost.tags.includes(newTag.trim())) {
      setNewPost({ ...newPost, tags: [...newPost.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setNewPost({ ...newPost, tags: newPost.tags.filter(tag => tag !== tagToRemove) });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const PostCard = ({ post }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.user.avatar || '/default-avatar.png'}
            alt={post.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {post.user.name}
              </h3>
              {post.user._id !== user?.id && (
                <button
                  onClick={() => handleFollowUser(post.user._id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    post.user.isFollowing
                      ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                  }`}
                >
                  {post.user.isFollowing ? <UserMinus className="h-3 w-3" /> : <UserPlus className="h-3 w-3" />}
                  {post.user.isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {post.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {post.content}
        </p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => handleLikePost(post._id)}
            className={`flex items-center space-x-2 transition-colors ${
              post.isLiked
                ? 'text-red-500'
                : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'
            }`}
          >
            <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes?.length || 0}</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments?.length || 0}</span>
          </button>
          
          <button
            onClick={() => handleBookmarkPost(post._id)}
            className={`flex items-center space-x-2 transition-colors ${
              post.isBookmarked
                ? 'text-emerald-500'
                : 'text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
          </button>
          
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        {/* Add Comment */}
        <div className="flex space-x-3 mb-4">
          <img
            src={user?.avatar || '/default-avatar.png'}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={() => handleAddComment(post._id)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Comments List */}
        {post.comments && post.comments.length > 0 && (
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment._id} className="flex space-x-3">
                <img
                  src={comment.user.avatar || '/default-avatar.png'}
                  alt={comment.user.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                  
                  {/* Comment Actions */}
                  <div className="flex items-center space-x-4 mt-2 ml-3">
                    <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{comment.likes?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => setReplyingTo(comment._id)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      Reply
                    </button>
                  </div>

                  {/* Reply Input */}
                  {replyingTo === comment._id && (
                    <div className="flex space-x-2 mt-2 ml-3">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => handleAddReply(post._id, comment._id)}
                        className="px-2 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition-colors"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-6 mt-2 space-y-2">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="flex space-x-2">
                          <img
                            src={reply.user.avatar || '/default-avatar.png'}
                            alt={reply.user.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-xs text-gray-900 dark:text-white">
                                  {reply.user.name}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 dark:text-gray-300">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  const NotificationItem = ({ notification }) => (
    <div
      className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
        !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
      onClick={() => handleMarkNotificationAsRead(notification._id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <img
            src={notification.sender.avatar || '/default-avatar.png'}
            alt={notification.sender.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-white">
              {notification.content}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatDate(notification.createdAt)}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteNotification(notification._id);
          }}
          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Community Hub
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with fellow plant enthusiasts
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* User Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSearchUsers()}
              />
              <button
                onClick={handleSearchUsers}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <NotificationItem key={notification._id} notification={notification} />
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No notifications
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Create Post Button */}
            <button
              onClick={() => setShowCreatePost(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 mb-6 border border-gray-200 dark:border-gray-700">
          {[
            { id: 'feed', label: 'Feed', icon: Users },
            { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
            { id: 'profile', label: 'Profile', icon: UserPlus }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentTab === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {currentTab === 'feed' && (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => <PostCard key={post._id} post={post} />)
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No posts yet. Be the first to share!</p>
                </div>
              )}
            </>
          )}

          {currentTab === 'bookmarks' && (
            <div className="text-center py-12">
              <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Your bookmarked posts will appear here</p>
            </div>
          )}

          {currentTab === 'profile' && (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Your profile and posts will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Create New Post
                  </h2>
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleCreatePost}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter post title..."
                        maxLength={150}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Content
                      </label>
                      <textarea
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Share your thoughts, plant care tips, or questions..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags
                      </label>
                      <div className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Add tags..."
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      {newPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {newPost.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-sm rounded-full flex items-center space-x-1"
                            >
                              <span>#{tag}</span>
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="text-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-200"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowCreatePost(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <span>Create Post</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Search Results Modal */}
      <AnimatePresence>
        {showUserSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Search Results
                  </h2>
                  <button
                    onClick={() => setShowUserSearch(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.map((user) => (
                      <div key={user._id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.avatar || '/default-avatar.png'}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </h3>
                            {user.bio && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user.bio}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleFollowUser(user._id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            user.isFollowing
                              ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                          }`}
                        >
                          {user.isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No users found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedCommunityHub; 