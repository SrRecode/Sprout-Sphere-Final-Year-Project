import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import AnimatedButton from './AnimatedButton';
import { aiPlantCareService } from '../services/aiPlantCareService';
import AnimatedSection from './AnimatedSection';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { toast } from 'react-toastify';
import {
  User,
  Heart,
  Bookmark,
  Settings,
  Bell,
  LogOut,
  Pencil,
  Camera
} from 'lucide-react';

const UserProfile = () => {
  const { user, logout, setUser } = useAuth(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    postalCode: '',
  });
  const [activeTab, setActiveTab] = useState('User info');
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Pre-fill form when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.name?.split(' ')[0] || 'User',
        lastName: user.name?.split(' ').slice(1).join(' ') || 'Name',
        email: user.email || 'test@example.com',
        phone: user.phone || '',
        location: user.location || '',
        postalCode: user.postalCode || '',
      });
      if (user.avatar) {
        setAvatarPreview(`${import.meta.env.VITE_API_URL}${user.avatar}`);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Create a preview URL
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Trigger file input click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Upload Avatar if a new file is selected
      let newAvatarUrl = user?.avatar; // Start with current avatar
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', avatarFile);

        const avatarRes = await userService.uploadAvatar(avatarFormData);
        if (avatarRes.success) {
          newAvatarUrl = avatarRes.data.avatar; // Get URL from backend response
          setAvatarFile(null); // Clear the file state after successful upload
          setAvatarPreview(newAvatarUrl); 
          toast.info('Avatar updated!');
        } else {
           toast.error(`Failed to upload avatar: ${avatarRes.message}`);
           setIsSaving(false); // Stop saving process if avatar fails
           return; // Exit early
        }
      }

      // 2. Update Profile Text Fields
      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        location: formData.location,
        phone: formData.phone,
        postalCode: formData.postalCode,
      };

      const profileRes = await userService.updateUserProfile(updateData);

      if (profileRes.success) {
        // Update the user state in AuthContext with the combined data
        const updatedUserData = { ...profileRes.data, avatar: newAvatarUrl };
        setUser(updatedUserData);
        toast.success('Profile saved successfully!');
      } else {
        toast.error(`Failed to save profile: ${profileRes.message}`);
      }

    } catch (err) {
      // This catch block might now be redundant if service handles all errors
      console.error('An unexpected error occurred in handleSaveChanges:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarNavItems = [
    { name: 'User info', icon: User },
    { name: 'Favorites', icon: Heart },
    { name: 'Watchlist', icon: Bookmark },
    { name: 'Setting', icon: Settings },
    { name: 'Notifications', icon: Bell },
  ];

  return (
    <AnimatedSection className="min-h-[calc(100vh-5rem)] bg-gray-50 dark:bg-dark-800/50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-dark-800/80 rounded-xl shadow-xl overflow-hidden lg:grid lg:grid-cols-12 border border-gray-100 dark:border-gray-700">
          {/* Sidebar Navigation */}
          <aside className="py-6 lg:col-span-3 border-r border-gray-200 dark:border-gray-700">
            <nav className="space-y-1 px-4">
              <h3 className="px-3 text-lg font-semibold text-gray-900 dark:text-white mb-4">User Profile</h3>
              {sidebarNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                    activeTab === item.name
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      activeTab === item.name ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </button>
              ))}
              <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-red-500 dark:text-red-400" />
                  <span>Sign out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 p-6">
            {activeTab === 'User info' && (
              <div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your profile information and avatar</p>
                </div>
                
                <div className="flex flex-col md:flex-row md:gap-10">
                  {/* Avatar Upload Section */}
                  <div className="mb-6 md:mb-0">
                    <div className="flex flex-col items-center">
                      <div 
                        className="relative w-32 h-32 group cursor-pointer overflow-hidden"
                        onClick={handleAvatarClick}
                      >
                        <div className="relative w-full h-full rounded-full border-4 border-primary-100 dark:border-primary-900/50 overflow-hidden">
                          <img
                            src={avatarPreview ? `${import.meta.env.VITE_API_URL}${avatarPreview}` : `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=4ADE80&color=fff`}
                            alt="User avatar"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Click to change avatar</p>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSaveChanges} className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First name</label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last name</label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          disabled
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white shadow-sm bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone number</label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                        <input
                          type="text"
                          name="location"
                          id="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="City, Country"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Postal code</label>
                        <input
                          type="text"
                          name="postalCode"
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <AnimatedButton
                        type="submit"
                        variant="primary"
                        className="bg-primary-gradient"
                        disabled={isSaving}
                        icon={isSaving ? null : Pencil}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </AnimatedButton>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {activeTab === 'Favorites' && (
              <div className="text-center py-12">
                <div className="rounded-full bg-primary-100 dark:bg-primary-900/20 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-primary-500 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Favorites</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">You haven't added any plants to your favorites yet.</p>
                <div className="mt-6">
                  <AnimatedButton
                    as="a"
                    href="/plant-store"
                    variant="outlinePrimary"
                  >
                    Browse Plants
                  </AnimatedButton>
                </div>
              </div>
            )}
            
            {/* Similar placeholder content for other tabs */}
            {(activeTab === 'Watchlist' || activeTab === 'Setting' || activeTab === 'Notifications') && (
              <div className="text-center py-12">
                <div className="rounded-full bg-primary-100 dark:bg-primary-900/20 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  {activeTab === 'Watchlist' && <Bookmark className="w-8 h-8 text-primary-500 dark:text-primary-400" />}
                  {activeTab === 'Setting' && <Settings className="w-8 h-8 text-primary-500 dark:text-primary-400" />}
                  {activeTab === 'Notifications' && <Bell className="w-8 h-8 text-primary-500 dark:text-primary-400" />}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{activeTab}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This feature is coming soon.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default UserProfile; 