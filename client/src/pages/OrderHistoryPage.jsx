// src/pages/OrderHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { format } from 'date-fns';

const OrderHistoryPage = ({ showModal }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/my-orders');
                setOrders(data.data || []);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                showModal('error', 'Could not load your order history.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [showModal]);

    if (loading) {
        return <div className="text-center p-10">Loading your orders...</div>;
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Order History</h1>
            {orders.length === 0 ? (
                <p className="text-gray-600">You haven't placed any orders yet.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Order #{order.id}</h2>
                                    <p className="text-sm text-gray-500">Placed on: {format(new Date(order.created_at), 'MMMM d, yyyy')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-600">Associated Cart ID: {order.cart_id}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;
