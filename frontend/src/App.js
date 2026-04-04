import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Users, Activity, Settings, LogOut, UserPlus, TrendingUp, DollarSign, Eye, Clock, Zap, Menu, X, Sun, Moon } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Login Component
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="glass p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Amazing Dashboard</h1>
          <p className="text-gray-300 mt-2">Experience the future of analytics</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter your password"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Default: admin / demo123</p>
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ user, onLogout }) {
  const [analytics, setAnalytics] = useState([]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [analyticsRes, usersRes, activitiesRes, summaryRes] = await Promise.all([
        axios.get(`${API_URL}/api/analytics`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/activities`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/dashboard`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
      setActivities(activitiesRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const chartData = analytics.map((item, index) => ({
    name: item.label,
    value: item.value,
    fill: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1'][index % 8]
  }));

  const pieData = analytics.slice(0, 5).map((item) => ({
    name: item.label,
    value: item.value
  }));

  const areaData = analytics.slice(0, 6).map((item, index) => ({
    name: item.label,
    value: item.value + Math.random() * 50
  }));

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full ${sidebarOpen ? 'w-64' : 'w-20'} ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl transition-all duration-300 z-50`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Amazing</span>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {sidebarOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        <nav className="mt-6 px-4">
          <a href="#" className={`flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
            <LayoutDashboard className="w-5 h-5" />
            {sidebarOpen && <span>Dashboard</span>}
          </a>
          <a href="#users" className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
            <Users className="w-5 h-5" />
            {sidebarOpen && <span>Users</span>}
          </a>
          <a href="#activities" className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
            <Activity className="w-5 h-5" />
            {sidebarOpen && <span>Activities</span>}
          </a>
          <a href="#settings" className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Settings</span>}
          </a>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button onClick={onLogout} className={`flex items-center space-x-3 px-4 py-3 rounded-xl w-full ${darkMode ? 'text-red-400 hover:bg-red-500/20' : 'text-red-600 hover:bg-red-50'}`}>
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-40`}>
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dashboard Overview</h1>
            <div className="flex items-center space-x-4">
              <button onClick={() => setDarkMode(!darkMode)} className={`${darkMode ? 'text-yellow-400' : 'text-gray-600'}`}>
                {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{user?.username?.charAt(0).toUpperCase()}</span>
                </div>
                <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{user?.username}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg border-l-4 border-cyan-500`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Total Users</p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{summary?.totalUsers || 0}</p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-cyan-500" />
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg border-l-4 border-purple-500`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Activities</p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{summary?.totalActivities || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg border-l-4 border-pink-500`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Metrics</p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{summary?.totalMetrics || 0}</p>
                </div>
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-pink-500" />
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg border-l-4 border-green-500`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Revenue</p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>${(analytics.find(a => a.metric_name === 'revenue')?.value || 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Analytics Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#fff', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg lg:col-span-2`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Trend Analysis</h2>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={areaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#fff', border: 'none', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Users Table */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg mb-8`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>User</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Email</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Role</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Joined</th>
                  </tr>
                </thead>
                <tbody className={`${darkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                  {users.map((user) => (
                    <tr key={user.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <span className={`ml-3 font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.username}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-400">{user.role}</span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activities */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Recent Activities</h2>
            <div className="space-y-4">
              {activities.slice(0, 10).map((activity) => (
                <div key={activity.id} className={`flex items-center space-x-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{activity.action}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>by {activity.username}</p>
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(activity.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Main App Component
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
