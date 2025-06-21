import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProgressChart = ({ learningItems }) => {
  // Calculate status distribution
  const statusCounts = learningItems.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    percentage: ((count / learningItems.length) * 100).toFixed(1)
  }));

  // Calculate type distribution
  const typeCounts = learningItems.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(typeCounts).map(([type, count]) => ({
    type,
    count,
    completed: learningItems.filter(item => item.type === type && item.status === 'Completed').length,
    inProgress: learningItems.filter(item => item.type === type && item.status === 'In Progress').length,
    started: learningItems.filter(item => item.type === type && item.status === 'Started').length
  }));

  const COLORS = {
    'Started': '#FCD34D',
    'In Progress': '#60A5FA',
    'Completed': '#34D399'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
          {payload[0].payload.percentage && (
            <p className="text-sm text-gray-600">{`${payload[0].payload.percentage}%`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (learningItems.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-500">No data to display. Add some learning items to see your progress!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Learning Progress Overview</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution - Pie Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4 text-center">Status Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex justify-center space-x-4 mt-4">
            {Object.entries(COLORS).map(([status, color]) => (
              <div key={status} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-sm text-gray-600">{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Type Distribution - Bar Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4 text-center">Learning Types</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="type" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="started" stackId="a" fill={COLORS['Started']} name="Started" />
              <Bar dataKey="inProgress" stackId="a" fill={COLORS['In Progress']} name="In Progress" />
              <Bar dataKey="completed" stackId="a" fill={COLORS['Completed']} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900">{learningItems.length}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-700">{statusCounts['Started'] || 0}</div>
            <div className="text-sm text-yellow-600">Started</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-700">{statusCounts['In Progress'] || 0}</div>
            <div className="text-sm text-blue-600">In Progress</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-700">{statusCounts['Completed'] || 0}</div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;