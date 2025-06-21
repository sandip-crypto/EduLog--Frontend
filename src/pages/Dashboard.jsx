import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Plus, Search, Edit3, Trash2, LogOut, GraduationCap, Filter, ExternalLink, BookOpen, Video, Award, BarChart3, TrendingUp } from 'lucide-react';
import LearningModal from '../components/LearningModal';
import ProgressChart from '../components/ProgressChart';
import StatsCards from '../components/StatsCards';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [learningItems, setLearningItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showChart, setShowChart] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const statusOptions = ['All', 'Started', 'In Progress', 'Completed'];
  const typeOptions = ['All', 'Course', 'Tutorial', 'Skill', 'Book', 'Other'];

  useEffect(() => {
    fetchLearningItems();
  }, []);

  const fetchLearningItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/learning`);
      setLearningItems(response.data);
    } catch (error) {
      toast.error('Failed to fetch learning items');
      console.error('Fetch learning items error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this learning item?')) {
      try {
        await axios.delete(`${API_URL}/api/learning/${itemId}`);
        setLearningItems(learningItems.filter(item => item._id !== itemId));
        toast.success('Learning item deleted successfully');
      } catch (error) {
        toast.error('Failed to delete learning item');
        console.error('Delete learning item error:', error);
      }
    }
  };

  const handleSaveItem = async (itemData) => {
    try {
      if (editingItem) {
        const response = await axios.put(`${API_URL}/api/learning/${editingItem._id}`, itemData);
        setLearningItems(learningItems.map(item => 
          item._id === editingItem._id ? response.data : item
        ));
        toast.success('Learning item updated successfully');
      } else {
        const response = await axios.post(`${API_URL}/api/learning`, itemData);
        setLearningItems([response.data, ...learningItems]);
        toast.success('Learning item created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save learning item');
      console.error('Save learning item error:', error);
    }
  };

  const handleStatusUpdate = async (itemId, newStatus) => {
    try {
      const response = await axios.put(`${API_URL}/api/learning/${itemId}`, { status: newStatus });
      setLearningItems(learningItems.map(item => 
        item._id === itemId ? response.data : item
      ));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Update status error:', error);
    }
  };

  const filteredItems = learningItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Started': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Course': return <GraduationCap className="h-4 w-4" />;
      case 'Tutorial': return <Video className="h-4 w-4" />;
      case 'Skill': return <Award className="h-4 w-4" />;
      case 'Book': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  EduLog
                </h1>
                <p className="text-sm text-gray-500">Learning Tracker</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 hidden sm:block">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards learningItems={learningItems} />

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Learning Journey</h2>
              <p className="text-gray-600 mt-1">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                {(statusFilter !== 'All' || typeFilter !== 'All' || searchTerm) && ' (filtered)'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
              <button
                onClick={() => setShowChart(!showChart)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span>{showChart ? 'Hide' : 'Show'} Chart</span>
              </button>
              <button
                onClick={handleCreateItem}
                className="flex items-center justify-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add Learning Item</span>
              </button>
            </div>
          </div>

          {/* Progress Chart */}
          {showChart && (
            <div className="mb-6">
              <ProgressChart learningItems={learningItems} />
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search learning items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Status' : status}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {typeOptions.map(type => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setTypeFilter('All');
              }}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Learning Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'All' || typeFilter !== 'All' 
                ? 'No learning items found' 
                : 'Start your learning journey'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'All' || typeFilter !== 'All'
                ? 'Try adjusting your filters or search terms'
                : 'Add your first learning item to begin tracking your progress'
              }
            </p>
            {!(searchTerm || statusFilter !== 'All' || typeFilter !== 'All') && (
              <button
                onClick={handleCreateItem}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <Plus className="h-5 w-5" />
                <span>Add Learning Item</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(item.type)}
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex space-x-2 ml-2">
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleEditItem(item)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {item.type}
                  </span>
                </div>
                
                {item.notes && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.notes}
                  </p>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    {formatDate(item.updatedAt)}
                  </div>
                  
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Started">Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Learning Modal */}
      <LearningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        item={editingItem}
      />
    </div>
  );
};

export default Dashboard;