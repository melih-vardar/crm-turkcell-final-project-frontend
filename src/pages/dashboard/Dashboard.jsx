import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { 
  AiOutlineUser, 
  AiOutlineShoppingCart, 
  AiOutlineFileText,
  AiOutlineCustomerService,
  AiOutlineArrowUp,
  AiOutlineArrowDown
} from 'react-icons/ai';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { getDashboardStats } from '../../api/dashboard';

// Register chart components
ChartJS.register(...registerables);

const Dashboard = () => {
  const { data: stats, isLoading, error } = useQuery('dashboardStats', getDashboardStats, {
    // Mock data for development
    initialData: {
      totalCustomers: 253,
      customerGrowth: 12,
      activePlans: 186,
      planGrowth: 5,
      monthlyRevenue: 28750,
      revenueGrowth: 8,
      supportTickets: 24,
      ticketGrowth: -3,
      revenueChart: [12500, 15000, 18000, 20500, 25000, 28750],
      customerChart: [150, 170, 195, 215, 240, 253],
      planDistribution: [45, 70, 42, 29],
      recentActivities: [
        { customer: 'John Doe', email: 'john@example.com', action: 'Subscription Upgraded', date: '2023-03-28', status: 'Completed' },
        { customer: 'Alice Smith', email: 'alice@example.com', action: 'New Customer', date: '2023-03-27', status: 'Completed' },
        { customer: 'Bob Johnson', email: 'bob@example.com', action: 'Support Ticket Created', date: '2023-03-27', status: 'Pending' },
        { customer: 'Emily Wilson', email: 'emily@example.com', action: 'Invoice Payment', date: '2023-03-26', status: 'Completed' },
        { customer: 'Michael Brown', email: 'michael@example.com', action: 'Plan Cancelled', date: '2023-03-26', status: 'Completed' },
      ]
    }
  });

  const cards = [
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: <AiOutlineUser size={24} />,
      color: 'bg-blue-500',
      change: stats?.customerGrowth || 0,
      link: '/customers'
    },
    {
      title: 'Active Plans',
      value: stats?.activePlans || 0,
      icon: <AiOutlineShoppingCart size={24} />,
      color: 'bg-green-500',
      change: stats?.planGrowth || 0,
      link: '/plans'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats?.monthlyRevenue?.toLocaleString() || 0}`,
      icon: <AiOutlineFileText size={24} />,
      color: 'bg-amber-500',
      change: stats?.revenueGrowth || 0,
      link: '/billing'
    },
    {
      title: 'Support Tickets',
      value: stats?.supportTickets || 0,
      icon: <AiOutlineCustomerService size={24} />,
      color: 'bg-purple-500',
      change: stats?.ticketGrowth || 0,
      link: '/support'
    },
  ];

  // Line chart data
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: stats?.revenueChart || [0, 0, 0, 0, 0, 0],
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      },
      {
        label: 'Customers',
        data: stats?.customerChart || [0, 0, 0, 0, 0, 0],
        fill: false,
        borderColor: 'rgb(16, 185, 129)',
        tension: 0.1
      }
    ]
  };

  // Doughnut chart data
  const doughnutChartData = {
    labels: ['Basic', 'Standard', 'Premium', 'Enterprise'],
    datasets: [
      {
        data: stats?.planDistribution || [0, 0, 0, 0],
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)'
        ]
      }
    ]
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading dashboard data</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link to={card.link} key={card.title} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
                <div className={`flex items-center mt-2 ${card.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {card.change >= 0 ? <AiOutlineArrowUp size={16} /> : <AiOutlineArrowDown size={16} />}
                  <span className="ml-1 text-sm">{Math.abs(card.change)}%</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${card.color} text-white`}>
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Customers Trend */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Revenue & Customer Trend</h2>
          <div className="h-64">
            <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Plan Distribution</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={doughnutChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Activities</h2>
          <Link to="/activities" className="text-primary text-sm">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(stats?.recentActivities || []).map((activity, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {activity.customer.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{activity.customer}</div>
                        <div className="text-sm text-gray-500">{activity.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{activity.action}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{activity.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${activity.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        activity.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 