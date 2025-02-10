const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const api = {
  createCheckoutSession: async (data: any) => {
    const response = await fetch(`${API_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  verifyPayment: async (data: any) => {
    const response = await fetch(`${API_URL}/api/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
}; 