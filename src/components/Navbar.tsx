import React, { useEffect, useState } from 'react';
import SearchIcon from '../images/search-icon.png';
import Avatar from 'react-avatar';
import { auth } from '../firebase/setup';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import Location from '../images/location.png';
import DropDownIcon from '../images/drop-down-icon.png';
import LogoutIcon from '../images/logout-icon.png';
import ShoppingCartIcon from '../images/shopping-cart-icon.png';
import { useCart } from '../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

interface cityProp {
    city?: any;
}

const Navbar = (props: cityProp) => {
    const [authStore, setAuthStore] = useState<any>({});
    const { cart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthStore(user || {});
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged Out Successfully!');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className='flex'>
                <h1 className='text-3xl font-extrabold italic ml-20'>MealMingle</h1>
                <div className='ml-6 shadow-lg flex items-center border border-gray-300 w-7/12 rounded-lg p-3 h-12'>
                    <img src={Location} alt='Location Icon' className='w-7 h-7 ml-2' />
                    <input className="outline-none text-gray-900 text-sm block w-40 p-2.5" placeholder={props.city ?? 'Location'} required />
                    <img src={DropDownIcon} alt='Drop Down Icon' className='w-5 h-5 ml-5' />
                    <div className='ml-3 text-gray-400'>|</div>
                    <img src={SearchIcon} alt='Search Icon' className='w-6 h-6 ml-5' />
                    <input className="outline-none text-gray-900 text-sm block w-96 p-2.5" placeholder="Search for Restaurant, Cuisine or a Dish" required />
                </div>
                <div className='flex items-center'>
                    {authStore?.photoURL ? (
                        <img src={authStore?.photoURL} alt='User Pic' className='w-12 h-12 ml-5 rounded-full' />
                    ) : authStore?.displayName ? (
                        <Avatar name={authStore?.displayName} round={true} size='40' className='ml-72' />
                    ) : null}
                    <div className='ml-2'>
                        {authStore?.displayName ? authStore.displayName : authStore?.email ? authStore.email : ''}
                    </div>
                    {authStore?.phoneNumber && <div className="text-gray-600 text-lg">{authStore.phoneNumber}</div>}
                    {!auth.currentUser?.email && !auth.currentUser?.phoneNumber && (
                        <Link to='/login'>
                            <div className='text-gray-600 text-lg cursor-pointer ml-20'>Login</div>
                        </Link>
                    )}
                    {!auth.currentUser?.email && !auth.currentUser?.phoneNumber && (
                        <Link to='/signup'>
                            <div className='text-gray-600 text-lg ml-5 cursor-pointer'>Sign Up</div>
                        </Link>
                    )}
                    {auth.currentUser&& (<Link to='/cart'>
                        <img src={ShoppingCartIcon} alt='Shopping Cart Icon' className='ml-4 shadow-lg p-2 rounded-xl text-gray-600 cursor-pointer w-10 h-10' />
                    </Link>)}
                    {auth.currentUser && (
                        <img onClick={logout} src={LogoutIcon} alt='Logout Icon' className='ml-4 shadow-lg p-2 rounded-xl text-gray-600 cursor-pointer w-10 h-10' />
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;