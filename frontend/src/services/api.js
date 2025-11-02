const API_BASE_URL = 'http://localhost:5000';

export const api = {
  // Get all accounts
  getAllAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/readalluser`);
    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }
    return response.json();
  },

  // Get account by ID
  getAccountById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/read/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch account');
    }
    return response.json();
  },

  // Create new account
  createAccount: async (accountData) => {
    const response = await fetch(`${API_BASE_URL}/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData),
    });
    if (!response.ok) {
      throw new Error('Failed to create account');
    }
    return response.json();
  },

  // Update account
  updateAccount: async (id, accountData) => {
    const response = await fetch(`${API_BASE_URL}/updateuser/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData),
    });
    if (!response.ok) {
      throw new Error('Failed to update account');
    }
    return response.json();
  },

  // Delete account
  deleteAccount: async (id) => {
    const response = await fetch(`${API_BASE_URL}/deleteuser/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete account');
    }
    return response.json();
  },
};

