import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Package,
  Calendar,
  ArrowUp,
  ArrowDown,
  Eye,
  Download
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    revenue: {
      current: 12450,
      previous: 10800,
      change: 15.3
    },
    orders: {
      current: 156,
      previous: 142,
      change: 9.9
    },
    users: {
      current: 1247,
      previous: 1156,
      change: 7.9
    },
    plants: {
      current: 342,
      previous: 298,
      change: 14.8
    },
    topProducts: [
      { name: 'Monstera Deliciosa', sales: 45, revenue: 3375 },
      { name: 'Snake Plant', sales: 38, revenue: 1746 },
      { name: 'ZZ Plant', sales: 32, revenue: 2432 },
      { name: 'Peace Lily', sales: 28, revenue: 1568 },
      { name: 'Fiddle Leaf Fig', sales: 25, revenue: 2750 }
    ],
    salesByCategory: [
      { category: 'Tropical', sales: 89, revenue: 6230 },
      { category: 'Indoor', sales: 67, revenue: 4020 },
      { category: 'Flowering', sales: 45, revenue: 2475 },
      { category: 'Succulent', sales: 34, revenue: 1530 },
      { category: 'Outdoor', sales: 23, revenue: 1150 }
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 8900 },
      { month: 'Feb', revenue: 10200 },
      { month: 'Mar', revenue: 11800 },
      { month: 'Apr', revenue: 12450 },
      { month: 'May', revenue: 13200 },
      { month: 'Jun', revenue: 14100 }
    ]
  });

  useEffect(() => {
    // Simulate fetching analytics data
    const fetchAnalytics = async () => {
      try {
        // In a real app, you'd fetch this from your API based on timeRange
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const MetricCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <div className="flex items-center mt-2">
            {change > 0 ? (
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(change)}% from last period
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const SimpleChart = ({ data, title, color = 'bg-emerald-500' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{item.name || item.category}</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${color}`}
                  style={{ width: `${(item.sales / Math.max(...data.map(d => d.sales))) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                {item.sales}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const RevenueChart = ({ data }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
      <div className="flex items-end justify-between h-32 space-x-2">
        {data.map((item, index) => {
          const maxRevenue = Math.max(...data.map(d => d.revenue));
          const height = (item.revenue / maxRevenue) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-emerald-100 dark:bg-emerald-900 rounded-t">
                <div 
                  className="bg-emerald-500 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

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
                Analytics
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View detailed analytics and reports
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={`$${analyticsData.revenue.current.toLocaleString()}`}
            change={analyticsData.revenue.change}
            icon={DollarSign}
            color="bg-emerald-500"
          />
          <MetricCard
            title="Total Orders"
            value={analyticsData.orders.current.toLocaleString()}
            change={analyticsData.orders.change}
            icon={ShoppingCart}
            color="bg-blue-500"
          />
          <MetricCard
            title="Total Users"
            value={analyticsData.users.current.toLocaleString()}
            change={analyticsData.users.change}
            icon={Users}
            color="bg-purple-500"
          />
          <MetricCard
            title="Total Plants"
            value={analyticsData.plants.current.toLocaleString()}
            change={analyticsData.plants.change}
            icon={Package}
            color="bg-green-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart data={analyticsData.monthlyRevenue} />
          <SimpleChart 
            data={analyticsData.salesByCategory} 
            title="Sales by Category"
            color="bg-blue-500"
          />
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Selling Products
            </h3>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Units Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {analyticsData.topProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${product.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${(product.sales / Math.max(...analyticsData.topProducts.map(p => p.sales))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {Math.round((product.sales / Math.max(...analyticsData.topProducts.map(p => p.sales))) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average Order Value</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${(analyticsData.revenue.current / analyticsData.orders.current).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {((analyticsData.orders.current / analyticsData.users.current) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Customer Retention</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">87.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Top Category</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Tropical</span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  New high-value order: $299.99
                </span>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Customer registered: john.doe@example.com
                </span>
                <span className="text-xs text-gray-500">15 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Product restocked: Monstera Deliciosa
                </span>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Low stock alert: Snake Plant
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

export default Analytics; 