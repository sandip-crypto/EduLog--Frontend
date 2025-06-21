import React from 'react';
import { TrendingUp, BookOpen, Award, Target } from 'lucide-react';

const StatsCards = ({ learningItems }) => {
  const totalItems = learningItems.length;
  const completedItems = learningItems.filter(item => item.status === 'Completed').length;
  const inProgressItems = learningItems.filter(item => item.status === 'In Progress').length;
  const startedItems = learningItems.filter(item => item.status === 'Started').length;
  
  const completionRate = totalItems > 0 ? ((completedItems / totalItems) * 100).toFixed(1) : 0;

  const stats = [
    {
      title: 'Total Learning Items',
      value: totalItems,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Completed',
      value: completedItems,
      icon: Award,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'In Progress',
      value: inProgressItems,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: Target,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-opacity-20`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
          
          {/* Progress bar for completion rate */}
          {stat.title === 'Completion Rate' && totalItems > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsCards;