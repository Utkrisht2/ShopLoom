// src/components/Header.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHistory, FaStore, FaSignOutAlt } from 'react-icons/fa';

const Header = ({ handleLogout }) => {
    const navigate = useNavigate();

    const onLogout = () => {
        handleLogout();
        navigate('/login');
    };

    // Style for active NavLink
    const activeLinkStyle = {
        color: '#4f46e5', // indigo-600
        borderBottom: '2px solid #4f46e5',
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-800">
                    <NavLink to="/" className="flex items-center gap-2">
                        <FaStore className="text-indigo-600" />
                        <span>SimpleStore</span>
                    </NavLink>
                </div>
                <div className="flex items-center space-x-6">
                    <NavLink
                        to="/cart"
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors pb-1"
                        style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                    >
                        <FaShoppingCart />
                        <span>Cart</span>
                    </NavLink>
                    <NavLink
                        to="/orders"
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors pb-1"
                        style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                    >
                        <FaHistory />
                        <span>Orders</span>
                    </NavLink>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 text-white bg-red-500 rounded-md px-4 py-2 hover:bg-red-600 transition-colors"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;