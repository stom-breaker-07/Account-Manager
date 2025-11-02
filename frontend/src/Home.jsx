import React, { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import { api } from './services/api';

function Home() {
  const { darkMode, toggleTheme } = useTheme();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await api.getAllAccounts();
      // Ensure data is an array and filter out any invalid entries
      setAccounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setAccounts([]); // Set to empty array on error
      alert('Failed to fetch accounts. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editingId) {
        // Update existing account
        await api.updateAccount(editingId, formData);
        alert('Account updated successfully!');
      } else {
        // Create new account
        await api.createAccount(formData);
        alert('Account created successfully!');
      }
      
      // Reset form
      setFormData({ name: '', email: '', password: '' });
      setEditingId(null);
      fetchAccounts();
    } catch (error) {
      console.error('Error saving account:', error);
      alert('Failed to save account');
    }
  };

  // Handle edit
  const handleEdit = (account) => {
    if (account && account._id) {
      setFormData({
        name: account.name || '',
        email: account.email || '',
        password: account.password || '',
      });
      setEditingId(account._id);
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this account?')) {
      return;
    }

    try {
      await api.deleteAccount(id);
      alert('Account deleted successfully!');
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setFormData({ name: '', email: '', password: '' });
    setEditingId(null);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (id) => {
    setShowPassword({
      ...showPassword,
      [id]: !showPassword[id],
    });
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } else {
      alert('Nothing to copy!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header with Theme Toggle */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Account Manager
            </h1>
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Form Section */}
        <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 transition-colors duration-300">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-white">
              {editingId ? 'Edit Account' : 'Add New Account'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Gmail, Facebook, etc."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email / Username
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email or username"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {editingId ? 'Update Account' : 'Add Account'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Accounts List Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 transition-colors duration-300 overflow-hidden">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
                Saved Accounts
              </h2>
              <button
                onClick={fetchAccounts}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors duration-300 flex items-center gap-2"
              >
                <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {loading && accounts.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading accounts...</p>
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">No accounts saved yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Add your first account using the form above</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {accounts.filter(account => account && account._id).map((account) => (
                  <div
                    key={account._id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-5 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-2">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                            {(account.name && account.name.charAt(0).toUpperCase()) || '?'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white truncate">
                              {account.name || 'Unnamed Account'}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {account.createdAt ? `Added ${new Date(account.createdAt).toLocaleDateString()}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 sm:mt-4 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 sm:w-16 flex-shrink-0">
                              Email:
                            </span>
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-sm sm:text-base text-gray-800 dark:text-white break-words flex-1 min-w-0">{account.email || 'N/A'}</span>
                              <button
                                onClick={() => copyToClipboard(account.email)}
                                className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors flex-shrink-0"
                                title="Copy email"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 sm:w-16 flex-shrink-0">
                              Password:
                            </span>
                            <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                              <span className="text-xs sm:text-sm text-gray-800 dark:text-white font-mono break-all flex-1 min-w-0">
                                {showPassword[account._id] ? (account.password || '') : '•'.repeat((account.password || '').length || 0)}
                              </span>
                              <button
                                onClick={() => togglePasswordVisibility(account._id)}
                                className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-shrink-0"
                                title={showPassword[account._id] ? 'Hide password' : 'Show password'}
                              >
                                {showPassword[account._id] ? (
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m13.42 13.42l-3.29-3.29M3 3l18 18" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                )}
                              </button>
                              <button
                                onClick={() => copyToClipboard(account.password)}
                                className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors flex-shrink-0"
                                title="Copy password"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col gap-2 sm:ml-4 justify-end sm:justify-start flex-shrink-0">
                        <button
                          onClick={() => handleEdit(account)}
                          className="p-2 sm:p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex-shrink-0"
                          title="Edit account"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(account._id)}
                          className="p-2 sm:p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 flex-shrink-0"
                          title="Delete account"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
