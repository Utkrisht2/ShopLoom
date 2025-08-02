// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaTrashAlt } from 'react-icons/fa'; // We will add remove functionality later

// Helper to get product images (placeholders)
const getProductImage = (name) => {
    const s = name.toLowerCase();
    if (s.includes('laptop')) return 'https://placehold.co/600x400/a3e635/333?text=Laptop';
    if (s.includes('mouse')) return 'https://placehold.co/600x400/f87171/333?text=Mouse';
    if (s.includes('keyboard')) return 'https://placehold.co/600x400/60a5fa/333?text=Keyboard';
    if (s.includes('monitor')) return 'https://placehold.co/600x400/fbbf24/333?text=Monitor';
    return 'https://placehold.co/600x400/e9d5ff/333?text=Product';
};

const CartPage = ({ showModal }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const { data } = await api.get('/my-cart');
                setCart(data.data);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
                showModal('error', 'Could not load your cart.');
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [showModal]);

    const handleCheckout = async () => {
        if (!cart || !cart.items || cart.items.length === 0) {
            showModal('error', 'Your cart is empty. Add items before checking out.');
            return;
        }
        try {
            await api.post('/orders', {});
            showModal('success', 'Order placed successfully!');
            navigate('/'); // Navigate back to shop after checkout
        } catch (error) {
            console.error('Checkout failed:', error);
            showModal('error', error.response?.data?.error || 'Checkout failed.');
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading your cart...</div>;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600">Looks like you haven't added anything to your cart yet.</p>
                <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-md">
                        {cart.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 border-b">
                                <div className="flex items-center gap-4">
                                    <img src={getProductImage(item.name)} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                    <div>
                                        <h2 className="font-semibold text-lg text-gray-800">{item.name}</h2>
                                        <p className="text-sm text-gray-500">Item ID: {item.id}</p>
                                    </div>
                                </div>
                                {/* Future remove button can go here */}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-6">
                            <span>Total Items</span>
                            <span>{cart.items.length}</span>
                        </div>
                        <button onClick={handleCheckout} className="w-full py-3 text-white bg-green-500 rounded-md hover:bg-green-600 font-bold">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;