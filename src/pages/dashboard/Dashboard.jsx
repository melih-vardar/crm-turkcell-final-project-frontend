import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { 
  AiOutlineUser, 
  AiOutlineShoppingCart, 
  AiOutlineFileText,
  AiOutlineCustomerService,
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineMessage
} from 'react-icons/ai';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { 
  getCustomerBehaviorAnalytics, 
  getCustomerSupportBehaviorAnalytics,
  getUserCreationAnalytics,
  getLoginAnalytics
} from '../../api/dashboard';

// Register chart components
ChartJS.register(...registerables);

const Dashboard = () => {
  // Fetch analytics data
  const { data: customerAnalytics, isLoading: customerLoading } = useQuery(
    'customerAnalytics',
    getCustomerBehaviorAnalytics,
    {
      enabled: false, // Disable for initial development
      initialData: {
        totalCustomers: 253,
        customerGrowth: 12,
        activePlans: 186,
        planGrowth: 5,
        monthlyRevenue: 28750,
        revenueGrowth: 8,
        customerChartData: [150, 170, 195, 215, 240, 253],
        planDistribution: [45, 70, 42, 29]
      }
    }
  );

  const { data: supportAnalytics, isLoading: supportLoading } = useQuery(
    'supportAnalytics',
    getCustomerSupportBehaviorAnalytics,
    {
      enabled: false, // Disable for initial development
      initialData: {
        supportTickets: 24,
        ticketGrowth: -3,
        averageResolutionTime: 1.5,
        ticketDistribution: [8, 10, 4, 2],
        ticketStatusDistribution: [12, 8, 3, 1]
      }
    }
  );

  const { data: userCreationAnalytics, isLoading: userCreationLoading } = useQuery(
    'userCreationAnalytics',
    getUserCreationAnalytics,
    {
      enabled: false, // Disable for initial development
      initialData: {
        totalUsers: 15,
        newUsersLastMonth: 3,
        userGrowth: 25,
        userCreationChart: [1, 2, 1, 3, 2, 3, 3]
      }
    }
  );

  const { data: loginAnalytics, isLoading: loginLoading } = useQuery(
    'loginAnalytics',
    getLoginAnalytics,
    {
      enabled: false, // Disable for initial development
      initialData: {
        totalLogins: 158,
        activeUsers: 12,
        loginFrequency: 5.2,
        loginChartData: [20, 25, 30, 28, 32, 23]
      }
    }
  );

  const cards = [
    {
      title: 'Toplam Müşteriler',
      value: customerAnalytics?.totalCustomers || 0,
      icon: <AiOutlineUser size={24} />,
      color: 'bg-blue-500',
      change: customerAnalytics?.customerGrowth || 0,
      link: '/customers'
    },
    {
      title: 'Aktif Planlar',
      value: customerAnalytics?.activePlans || 0,
      icon: <AiOutlineShoppingCart size={24} />,
      color: 'bg-green-500',
      change: customerAnalytics?.planGrowth || 0,
      link: '/plans'
    },
    {
      title: 'Aylık Gelir',
      value: `₺${customerAnalytics?.monthlyRevenue?.toLocaleString() || 0}`,
      icon: <AiOutlineFileText size={24} />,
      color: 'bg-amber-500',
      change: customerAnalytics?.revenueGrowth || 0,
      link: '/bills'
    },
    {
      title: 'Destek Talepleri',
      value: supportAnalytics?.supportTickets || 0,
      icon: <AiOutlineCustomerService size={24} />,
      color: 'bg-purple-500',
      change: supportAnalytics?.ticketGrowth || 0,
      link: '/support'
    },
  ];

  // Bar chart for user creation data
  const userCreationChartData = {
    labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
    datasets: [
      {
        label: 'Yeni Kullanıcılar',
        data: userCreationAnalytics?.userCreationChart || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      }
    ]
  };

  // Line chart for login data
  const loginChartData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
      {
        label: 'Giriş Sayısı',
        data: loginAnalytics?.loginChartData || [0, 0, 0, 0, 0, 0],
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      }
    ]
  };

  // Doughnut chart for customer plan distribution
  const customerChartData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
      {
        label: 'Müşteri Sayısı',
        data: customerAnalytics?.customerChartData || [0, 0, 0, 0, 0, 0],
        fill: false,
        borderColor: 'rgb(16, 185, 129)',
        tension: 0.1
      }
    ]
  };

  // Doughnut chart for plan distribution
  const planDistributionChartData = {
    labels: ['Temel', 'Standart', 'Premium', 'Kurumsal'],
    datasets: [
      {
        data: customerAnalytics?.planDistribution || [0, 0, 0, 0],
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)'
        ]
      }
    ]
  };

  // Doughnut chart for ticket distribution
  const ticketDistributionChartData = {
    labels: ['Teknik', 'Fatura', 'Satış', 'Genel'],
    datasets: [
      {
        data: supportAnalytics?.ticketDistribution || [0, 0, 0, 0],
        backgroundColor: [
          'rgb(239, 68, 68)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(107, 114, 128)'
        ]
      }
    ]
  };

  // Doughnut chart for ticket status
  const ticketStatusChartData = {
    labels: ['Açık', 'İşlemde', 'Beklemede', 'Kapalı'],
    datasets: [
      {
        data: supportAnalytics?.ticketStatusDistribution || [0, 0, 0, 0],
        backgroundColor: [
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(16, 185, 129)'
        ]
      }
    ]
  };

  const isLoading = customerLoading || supportLoading || userCreationLoading || loginLoading;

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Dashboard yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gösterge Paneli</h1>
        <div className="text-sm text-gray-500">Son güncelleme: {new Date().toLocaleString()}</div>
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

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth Trend */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Müşteri Büyüme Trendi</h2>
          <div className="h-64">
            <Line data={customerChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Plan Dağılımı</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={planDistributionChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* User Login & Creation Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Creation */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Haftalık Kullanıcı Oluşturma</h2>
          <div className="h-64">
            <Bar data={userCreationChartData} options={{ maintainAspectRatio: false }} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <AiOutlineUserAdd size={20} className="text-blue-500 mr-2" />
                <span className="text-lg font-semibold">{userCreationAnalytics?.totalUsers || 0}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Toplam Kullanıcı</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <AiOutlineArrowUp size={20} className="text-green-500 mr-2" />
                <span className="text-lg font-semibold">{userCreationAnalytics?.newUsersLastMonth || 0}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Son Ay Yeni Kullanıcı</p>
            </div>
          </div>
        </div>

        {/* Login Activity */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Giriş Aktivitesi</h2>
          <div className="h-64">
            <Line data={loginChartData} options={{ maintainAspectRatio: false }} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <AiOutlineLogin size={20} className="text-blue-500 mr-2" />
                <span className="text-lg font-semibold">{loginAnalytics?.totalLogins || 0}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Toplam Giriş</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <AiOutlineUser size={20} className="text-green-500 mr-2" />
                <span className="text-lg font-semibold">{loginAnalytics?.activeUsers || 0}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Aktif Kullanıcılar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Support Tickets Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Distribution */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Destek Talebi Kategorileri</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={ticketDistributionChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Ticket Status */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Destek Talebi Durumları</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={ticketStatusChartData} options={{ maintainAspectRatio: false }} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <AiOutlineMessage size={20} className="text-blue-500 mr-2" />
                <span className="text-lg font-semibold">{supportAnalytics?.supportTickets || 0}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Toplam Talepler</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <AiOutlineCustomerService size={20} className="text-amber-500 mr-2" />
                <span className="text-lg font-semibold">{supportAnalytics?.averageResolutionTime || 0} gün</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Ort. Çözüm Süresi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 