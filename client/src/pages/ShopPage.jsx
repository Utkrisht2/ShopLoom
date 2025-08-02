// src/pages/ShopPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Helper to get product images (can be shared or defined here)
const getProductImage = (name) => {
    const s = name.toLowerCase();
    if (s.includes('laptop')) return 'https://placehold.co/600x400/a3e635/333?text=Laptop';
    if (s.includes('mouse')) return 'https://placehold.co/600x400/f87171/333?text=Mouse';
    if (s.includes('keyboard')) return 'https://placehold.co/600x400/60a5fa/333?text=Keyboard';
    if (s.includes('monitor')) return 'https://placehold.co/600x400/fbbf24/333?text=Monitor';
    return 'https://placehold.co/600x400/e9d5ff/333?text=Product';
};


const ShopPage = ({ showModal }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get('/items');
                setItems(response.data.data || []);
            } catch (error) {
                console.error('Failed to fetch items:', error);
                showModal('error', 'Could not load products.');
            }
        };
        fetchItems();
    }, [showModal]);

    const handleAddItemToCart = async (item) => {
        try {
            await api.post('/carts', { item_ids: [item.id] });
            showModal('success', `'${item.name}' added to cart!`);
        } catch (error) {
            console.error('Failed to add item to cart:', error);
            showModal('error', 'Failed to add item. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
                            <div className="relative">
                                <img src={getProductImage(item.name)} alt={item.name} className="w-full h-56 object-cover" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleAddItemToCart(item)}
                                        className="text-white bg-indigo-600 px-4 py-2 rounded-full font-semibold"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No items available to show. The store owner needs to add some!</p>
                )}
            </div>
        </div>
    );
};

export default ShopPage;