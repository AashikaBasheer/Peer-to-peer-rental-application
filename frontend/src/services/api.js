import axios from 'axios';
import { supabase } from "../lib/supabase";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});


export const loginUser = async (loginData) => {
  const response = await api.post(
    "/auth/login",
    loginData
  );

  return response.data;
};


export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};

export const getProducts = async () => {
  const response = await api.get(
    "/items/available"
  );

  return response.data;
};


export const getProductById = async (productId) => {
  const response = await api.get(
    `/items/${productId}`
  );

  return response.data;
};

export const getItemImages = async (itemId) => {
  const response = await api.get(`/items/${itemId}/images`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export const getBookingsByRenter = async (renterId) => {
  const response = await api.get(`/bookings/renter/${renterId}`);
  return response.data;
};

export const getBookingsByLender = async (lenderId) => {
  const response = await api.get(`/bookings/lender/${lenderId}`);
  return response.data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const response = await api.put(`/bookings/${bookingId}/status`, null, {
    params: { status },
  });
  return response.data;
};

export const createPayment = async (paymentData) => {
  const response = await api.post("/payments", paymentData);
  return response.data;
};


export const createProduct = async (productData) => {
  const response = await api.post(
    "/items",
    productData
  );

  return response.data;
};

export const getMyItems = async (ownerId) => {
  const response = await api.get(`/items/owner/${ownerId}`);
  return response.data;
};


export const updateProduct = async (
  productId,
  productData
) => {

  const response = await api.put(
    `/items/${productId}`,
    productData
  );

  return response.data;
};


export const deleteProduct = async (productId) => {

  const response = await api.delete(
    `/items/${productId}`
  );

  return response.data;
};

export const searchProducts = async (keyword) => {

  const response = await api.get(
    "/products/search",
    {
      params: {
        keyword: keyword,
      },
    }
  );

  return response.data;
};

export const getProductsByCategory = async (
  category
) => {

  const response = await api.get(
    `/products/category/${category}`
  );

  return response.data;
};

export const createRentalRequest = async (
  rentalData
) => {

  const response = await api.post(
    "/rentals/request",
    rentalData
  );

  return response.data;
};


export const getMyRentals = async () => {

  const response = await api.get(
    "/rentals/my-rentals"
  );

  return response.data;
};


export const getRentalRequests = async () => {

  const response = await api.get(
    "/rentals/requests"
  );

  return response.data;
};


export const updateRentalRequest = async (
  rentalId,
  status
) => {

  const response = await api.put(
    `/rentals/${rentalId}/status`,
    {
      status: status,
    }
  );

  return response.data;
};

export const getUserProfile = async () => {

  const response = await api.get(
    "/users/profile"
  );

  return response.data;
};


export const updateUserProfile = async (
  userData
) => {

  const response = await api.put(
    "/users/profile",
    userData
  );

  return response.data;
};

export const getNotifications = async () => {

  const response = await api.get(
    "/notifications"
  );

  return response.data;
};


export default api;