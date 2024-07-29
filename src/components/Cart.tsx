import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useCart, CartItem } from '../context/CartContext';
import restaurants from '../restaurants.json';

const Cart = () => {
    const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.restaurantItemPrice * item.quantity), 0);
    };

    const calculateDiscountedPrice = (totalPrice: number, minOrderAmount: number, discountPercentage: number) => {
        if (totalPrice > minOrderAmount) {
            const discountAmount = (totalPrice * discountPercentage) / 100;
            const discountedPrice = totalPrice - discountAmount;
            return { discountedPrice, discountAmount };
        } else {
            return { discountedPrice: totalPrice, discountAmount: 0 };
        }
    };

    const uniqueRestaurantId = cart.length > 0 ? cart[0].restaurantItemId.split('_')[0] : '';

    const restaurant = restaurants.find((r) => r.restaurantId === uniqueRestaurantId);

    const totalPrice = calculateTotalPrice();
    let discountedPrice = totalPrice;
    let discountAmount = 0;

    if (restaurant && restaurant.restaurantDiscountPercentage > 0 && totalPrice > restaurant.restaurantMinimumOrderAmount) {
        const { discountedPrice: calculatedDiscountedPrice, discountAmount: calculatedDiscountAmount } = calculateDiscountedPrice(
            totalPrice,
            restaurant.restaurantMinimumOrderAmount,
            restaurant.restaurantDiscountPercentage
        );
        discountedPrice = calculatedDiscountedPrice;
        discountAmount = calculatedDiscountAmount;
    }

    const proceedToPayment = () => {
        if (cart.length > 0 && restaurant) {
            const paymentState = {
                items: cart,
                restaurant,
                totalPrice: discountedPrice
            };
            localStorage.setItem('paymentState', JSON.stringify(paymentState));
            navigate('/payment');
        }
    };

    return (
        <>
            <Navbar city="Location" />
            <div className='p-4 pl-20'>
                <h1 className='font-semibold text-3xl mb-4'>Your Cart</h1>
                {cart.length === 0 ? (
                    <p className="text-center text-xl mt-72">Your Cart is Empty!</p>
                ) : (
                    <div>
                        <div className='grid grid-cols-3 gap-4'>
                            {cart.map((item: CartItem) => (
                                <div key={item.id} className='max-w-xs rounded-xl overflow-hidden shadow-sm'>
                                    <img className='w-full rounded-2xl h-60 object-cover' src={require(`../images/${item.restaurantItemImageUrl}`)} alt={item.restaurantItemName} />
                                    <div className='py-4'>
                                        <div className='flex justify-between items-center'>
                                            <div className='font-semibold text-xl mb-2'>{item.restaurantItemName}</div>
                                            <p className='font-semibold text-base p-1'>₹{item.restaurantItemPrice}</p>
                                        </div>
                                        <div className='flex justify-between items-center mt-2'>
                                            <select
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                className='mr-2 px-4 py-2 border border-gray-300 rounded'
                                            >
                                                {[...Array(10)].map((_, index) => (
                                                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                                                ))}
                                            </select>
                                            <button onClick={() => removeFromCart(item.id)} className='inline-block px-2 py-2 bg-red-500 text-white rounded'>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='mt-5'>
                            <p className='font-semibold'>Total Price: ₹{totalPrice}</p>
                            {restaurant && restaurant.restaurantDiscountPercentage > 0 && totalPrice > restaurant.restaurantMinimumOrderAmount && (
                                <>
                                    <p className='font-semibold'>Discount: {restaurant.restaurantDiscountPercentage}%</p>
                                    <p className='font-semibold'>Discount Amount: ₹{discountAmount.toFixed(2)}</p>
                                    <p className='font-semibold'>Discounted Price: ₹{discountedPrice.toFixed(2)}</p>
                                </>
                            )}
                            <button onClick={clearCart} className='mr-4 mt-5 px-4 py-2 bg-red-500 text-white rounded'>Clear Cart</button>
                            <button onClick={proceedToPayment} className='px-4 py-2 bg-green-500 text-white rounded'>Proceed to Payment</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;