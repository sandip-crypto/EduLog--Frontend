import React, { useState, useEffect } from 'react';
import { X, Save, LinkIcon, FileText } from 'lucide-react';

const LearningModal = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Course',
    link: '',
    status: 'Started',
    notes: ''
  });

  const typeOptions = ['Course', 'Tutorial', 'Skill', 'Book', 'Other'];
  const statusOptions = ['Started', 'In Progress', 'Completed'];

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        type: item.type,
        link: item.link || '',
        status: item.status,
        notes: item.notes || ''
      });
    } else {
      setFormData({
        title: '',
        type: 'Course',
        link: '',
        status: 'Started',
        notes: ''
      });
    }
  }, [item, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return;
    }
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 flex flex-col max-h-[calc(100vh-4rem)]">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {item ? 'Edit Learning Item' : 'Add New Learning Item'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., React Hooks Complete Guide"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>

              {/* Type and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all text-sm sm:text-base"
                  >
                    {typeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all text-sm sm:text-base"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="h-4 w-4" />
                    <span>Resource Link (Optional)</span>
                  </div>
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=... or course URL"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add YouTube links, course URLs, or any learning resource
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Personal Notes (Optional)</span>
                  </div>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add your thoughts, key takeaways, or progress notes..."
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="border-t bg-white p-4 sm:p-6 rounded-b-xl flex-shrink-0">
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm sm:text-base font-medium order-1 sm:order-2"
            >
              <Save className="h-4 w-4" />
              <span>{item ? 'Update' : 'Create'} Item</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningModal;