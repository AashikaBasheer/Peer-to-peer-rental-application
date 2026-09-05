import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import ProductsPage from "../pages/ProductsPage"; 
import ProductDetailsPage from "../pages/ProductDetailsPage";
import PaymentPage from "../pages/PaymentPage";
import NotificationsPage from "../pages/NotificationsPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products" element={<ProductsPage />} /> 
        <Route path="/products/:productId" element={<ProductDetailsPage />}/>
        <Route path="/payment" element={<PaymentPage />}/>
        <Route path="/notifications" element={<NotificationsPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/home" element={<HomePage />}/>
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
