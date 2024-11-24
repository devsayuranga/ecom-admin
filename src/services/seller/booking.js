import request from '../request';

const url = 'dashboard/seller/bookings';

const sellerBookingService = {
  getAll: (params) => request.get(url, { params }),
  getById: (id) => request.get(`${url}/${id}`),
  create: (id, data) => request.post(`${url}/${id}`, data),
  update: (id, data) => request.put(`${url}/${id}`, data),
  delete: (params) => request.delete(`${url}/delete`, { params }),
  changeStatus: (id, data) => request.post(`${url}/${id}/status/update`, data),
};

export default sellerBookingService;
