import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useCart, CartItem } from '../context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Menu = () => {
    const location = useLocation();
    const { data } = location.state;
    const { addToCart, checkIfSameRestaurant } = useCart();
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

    const handleAddToCart = (item: CartItem) => {
        const quantity = quantities[item.restaurantItemId] || 1;
        const success = addToCart(item, quantity);
        if (success) {
            toast.success(`${item.restaurantItemName} added to Cart!`);
        }
    };

    const handleQuantityChange = (itemId: string, quantity: number) => {
        setQuantities(prevState => ({
            ...prevState,
            [itemId]: quantity,
        }));
    };

    return (
        <>
            <Navbar city={data.restaurantAddress.city} />
            <div className='p-4 pl-20'>
                <h1 className='font-semibold text-3xl mb-4'>Explore the Menu of {data.restaurantName}</h1>
                <div className='grid grid-cols-3'>
                    {data.restaurantItems.map((item: CartItem) => (
                        <div key={item.restaurantItemId} className='max-w-xs rounded-xl overflow-hidden shadow-sm mt-12'>
                            <img className='w-full rounded-2xl h-60 object-cover' src={require(`../images/${item.restaurantItemImageUrl}`)} alt={item.restaurantItemName} />
                            <div className='py-4'>
                                <div className='flex justify-between items-center'>
                                    <div className='font-semibold text-xl mb-2'>{item.restaurantItemName}</div>
                                    <p className='font-semibold text-base p-1'>₹{item.restaurantItemPrice}</p>
                                </div>
                                <div className='flex justify-between items-center mt-2'>
                                    <select
                                        value={quantities[item.restaurantItemId] || 1}
                                        onChange={(e) => handleQuantityChange(item.restaurantItemId, parseInt(e.target.value))}
                                        className='mr-2 px-4 py-2 border border-gray-300 rounded'
                                    >
                                        {[...Array(10)].map((_, index) => (
                                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                                        ))}
                                    </select>
                                    <button onClick={() => handleAddToCart(item)} className='inline-block px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300'>Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Menu;