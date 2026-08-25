import api from './api';

export const paymentService = {
  initiatePayment: async (orderId) => {
    const response = await api.post('/payment/initiate', { orderId });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/payment/verify', paymentData);
    return response.data;
  }
};
