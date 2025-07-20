import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Package, 
  MessageSquare, 
  TrendingUp, 
  ShoppingCart, 
  DollarSign,
  BarChart3,
  Settings,
  FileText,
  Shield
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlants: 0,
    totalPosts: 0,
    totalOrders: 0,
    revenue: 0,
    activeChats: 0
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate fetching dashboard stats
    const fetchStats = async () => {
      try {
        // In a real app, you'd fetch this from your API
        const mockStats = {
          totalUsers: 1247,
          totalPlants: 342,
          totalPosts: 89,
          totalOrders: 156,
          revenue: 12450,
          activeChats: 12
        };
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminSections = [
    {
      title: 'Users Management',
      description: 'Manage user accounts, roles, and permissions',
      icon: Users,
      path: '/admin/users',
      color: 'bg-blue-500',
      stats: stats.totalUsers
    },
    {
      title: 'Plant Inventory',
      description: 'Manage plant catalog, stock, and pricing',
      icon: Package,
      path: '/admin/plants',
      color: 'bg-green-500',
      stats: stats.totalPlants
    },
    {
      title: 'Community Posts',
      description: 'Moderate community content and discussions',
      icon: MessageSquare,
      path: '/admin/posts',
      color: 'bg-purple-500',
      stats: stats.totalPosts
    },
    {
      title: 'Orders & Sales',
      description: 'View orders, track sales, and manage fulfillment',
      icon: ShoppingCart,
      path: '/admin/orders',
      color: 'bg-orange-500',
      stats: stats.totalOrders
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics and reports',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'bg-indigo-500'
    },
    {
      title: 'AI Chat Management',
      description: 'Monitor and manage AI chat interactions',
      icon: MessageSquare,
      path: '/admin/chat',
      color: 'bg-teal-500',
      stats: stats.activeChats
    },
    {
      title: 'Content Management',
      description: 'Manage blog posts, guides, and static content',
      icon: FileText,
      path: '/admin/content',
      color: 'bg-pink-500'
    },
    {
      title: 'System Settings',
      description: 'Configure system settings and preferences',
      icon: Settings,
      path: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const SectionCard = ({ section }) => {
    const Icon = section.icon;
    return (
      <Link
        to={section.path}
        className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-full ${section.color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {section.stats && (
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {section.stats}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {section.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {section.description}
        </p>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back! Here's what's happening with your store.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Admin Panel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Overview Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <StatCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              icon={Users}
              color="bg-blue-500"
              change={12}
            />
            <StatCard
              title="Total Plants"
              value={stats.totalPlants.toLocaleString()}
              icon={Package}
              color="bg-green-500"
              change={8}
            />
            <StatCard
              title="Total Posts"
              value={stats.totalPosts.toLocaleString()}
              icon={MessageSquare}
              color="bg-purple-500"
              change={-3}
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders.toLocaleString()}
              icon={ShoppingCart}
              color="bg-orange-500"
              change={15}
            />
            <StatCard
              title="Revenue"
              value={`$${stats.revenue.toLocaleString()}`}
              icon={DollarSign}
              color="bg-emerald-500"
              change={22}
            />
            <StatCard
              title="Active Chats"
              value={stats.activeChats.toLocaleString()}
              icon={MessageSquare}
              color="bg-teal-500"
              change={5}
            />
          </div>
        </div>

        {/* Admin Sections */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {adminSections.map((section, index) => (
              <SectionCard key={index} section={section} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  New user registration: john.doe@example.com
                </span>
                <span className="text-xs text-gray-500">2 minutes ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  New order placed: #ORD-2024-001
                </span>
                <span className="text-xs text-gray-500">15 minutes ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  New community post: "Best indoor plants for beginners"
                </span>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Plant inventory updated: Monstera Deliciosa stock increased
                </span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 