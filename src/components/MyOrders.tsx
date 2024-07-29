import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

interface OrderItem {
    restaurantItemId: string;
    restaurantItemName: string;
    restaurantItemPrice: number;
    quantity: number;
    restaurantItemImageUrl: string;
}

interface ShippingAddress {
    streetNumber: string;
    streetName: string;
    city: string;
    country: string;
}

interface Order {
    id: string;
    items: OrderItem[];
    totalAmount: number;
    orderDate: string;
    orderTimestamp: number;
    status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Delivered';
    shippingAddress: ShippingAddress;
}

const MyOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
            const parsedOrders: Order[] = JSON.parse(savedOrders).map((order: any) => ({
                ...order,
                status: order.status || 'Pending',
            }));
            setOrders(parsedOrders);
        } else {
            setOrders([]);
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setOrders((prevOrders) => {
                const updatedOrders = prevOrders.map(order => {
                    const timeRemaining = getTimeRemaining(order.orderTimestamp);
                    if (timeRemaining <= 0) {
                        return {
                            ...order,
                            orderTimestamp: 0,
                        };
                    }
                    return order;
                });
                localStorage.setItem('orders', JSON.stringify(updatedOrders));
                return updatedOrders;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const cancelOrder = (orderId: string) => {
        const isConfirmed = window.confirm('Are you sure you want to Cancel this Order?');
        if (isConfirmed) {
            const updatedOrders = orders.filter(order => order.id !== orderId);
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
            setOrders(updatedOrders);
        }
    };

    const getTimeRemaining = (timestamp: number) => {
        if (timestamp === 0) return 0;
        const currentTime = Date.now();
        const timePassed = currentTime - timestamp;
        const timeLeft = 300000 - timePassed;
        return timeLeft > 0 ? timeLeft : 0;
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <>
            <Navbar />
            <div className='p-4 pl-20'>
                <h1 className='font-semibold text-3xl mb-4'>My Orders</h1>
                {orders.length === 0 ? (
                    <p className="text-center text-xl mt-72">You have No Orders yet!</p>
                ) : (
                    <div className='space-y-4'>
                        {orders.map((order) => {
                            const timeRemaining = getTimeRemaining(order.orderTimestamp);
                            return (
                                <div key={order.id} className='border p-4 rounded shadow mr-10'>
                                    <h2 className='text-xl font-semibold mb-2'>Order ID: {order.id}</h2>
                                    <p className='text-gray-600 mb-2'>Order Date: {order.orderDate}</p>
                                    <p className='text-gray-600 mb-2'>Status: {order.status}</p>
                                    <div className='text-gray-600 mb-2'>
                                        Shipping Address: {order.shippingAddress.streetNumber}, {order.shippingAddress.streetName}, {order.shippingAddress.city}, {order.shippingAddress.country}
                                    </div>
                                    <div className='space-y-2'>
                                        {order.items.map((item, index) => (
                                            <div key={index} className='flex justify-between items-center p-2 border-b'>
                                                <div className='flex flex-col'>
                                                    <span className='font-semibold'>{item.restaurantItemName}</span>
                                                    <span className='text-gray-500'>Qty: {item.quantity}</span>
                                                </div>
                                                <div className='flex flex-col items-end'>
                                                    <span className='text-gray-500'>Price: ₹{item.restaurantItemPrice}</span>
                                                    <span className='font-semibold'>Total: ₹{item.restaurantItemPrice * item.quantity}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='font-semibold mt-2'>Total Amount: ₹{order.totalAmount}</div>
                                    {timeRemaining > 0 && (
                                        <div className='mt-2'>
                                            <p className='text-red-500'>
                                                Time Left to Cancel: {formatTime(timeRemaining)}
                                            </p>
                                            <button
                                                onClick={() => cancelOrder(order.id)}
                                                className='mt-2 px-4 py-2 bg-red-500 text-white rounded'
                                            >
                                                Cancel Order
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyOrders;