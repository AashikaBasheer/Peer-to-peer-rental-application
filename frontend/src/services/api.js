import axios from 'axios';
import { supabase } from "../lib/supabase";

const API_BASE_URL = "http://localhost:8080/api";

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
    "/products"
  );

  return response.data;
};


export const getProductById = async (productId) => {
  const response = await api.get(
    `/products/${productId}`
  );

  return response.data;
};


export const createProduct = async (productData) => {
  const response = await api.post(
    "/products",
    productData
  );

  return response.data;
};


export const updateProduct = async (
  productId,
  productData
) => {

  const response = await api.put(
    `/products/${productId}`,
    productData
  );

  return response.data;
};


export const deleteProduct = async (productId) => {

  const response = await api.delete(
    `/products/${productId}`
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