// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Modal from './components/Modal';

function App() {
    const [modal, setModal] = useState({ type: '', message: '' });

    const handleSetToken = (userToken) => {
        localStorage.setItem('token', userToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        // Navigation will be handled by the component that calls this
    };

    const showModal = (type, message) => {
        setModal({ type, message });
    };

    const closeModal = () => {
        setModal({ type: '', message: '' });
    };

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage setToken={handleSetToken} />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected Routes inside a Layout */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <Layout handleLogout={handleLogout} />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/" element={<ShopPage showModal={showModal} />} />
                        <Route path="/cart" element={<CartPage showModal={showModal} />} />
                        <Route path="/orders" element={<OrderHistoryPage showModal={showModal} />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <Modal type={modal.type} message={modal.message} onClose={closeModal} />
        </>
    );
}

export default App;