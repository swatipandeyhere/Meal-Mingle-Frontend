import React from 'react'
import Dish1 from '../images/dish-1.png'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/authContext';

interface restaurantProp {
    restaurant: any,
    city: any
}

const Restaurant = (props: restaurantProp) => {
    const { isLoggedIn } = useAuth();
    return (
        <div className='p-4 pl-20'>
            <div className='font-semibold text-3xl'>
                {props.city ? `Best Food in ${props.city}` : 'Best Food in Location'}
            </div>
            {props.city ? <div className='grid grid-cols-3'>
                {props.restaurant.filter((data: any) => data.restaurantAddress.city.includes(props.city)).map((data: any) => {
                    console.log(data);
                    return <>
                        {isLoggedIn ? (
                            <Link to='/menu' state={{ data: data }}>
                                <div className="max-w-xs rounded-xl overflow-hidden shadow-sm mt-12">
                                    <img className="w-full rounded-2xl h-60" src={require(`../images/${data.restaurantImage}`)} alt="Restaurant Image" />
                                    <div className="py-4">
                                        <div className='flex justify-between items-center'>
                                            <div className="font-semibold text-xl mb-2">{data.restaurantName}</div>
                                            <div className={`text-white font-semibold text-base rounded-md p-1 ${data.restaurantRating < 4.5 ? `bg-green-600` : `bg-green-900`}`}>
                                                {data.restaurantRating}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>) : (<Link to='/login' state={{ data: data }}>
                                <div className="max-w-xs rounded-xl overflow-hidden shadow-sm mt-12">
                                    <img className="w-full rounded-2xl h-60" src={require(`../images/${data.restaurantImage}`)} alt="Restaurant Image" />
                                    <div className="py-4">
                                        <div className='flex justify-between items-center'>
                                            <div className="font-semibold text-xl mb-2">{data.restaurantName}</div>
                                            <div className={`text-white font-semibold text-base rounded-md p-1 ${data.restaurantRating < 4.5 ? `bg-green-600` : `bg-green-900`}`}>
                                                {data.restaurantRating}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>)}
                    </>
                })}
            </div>
                :
                <div className='grid grid-cols-3'>
                    {props.restaurant.map((data: any) => {
                        console.log(data);
                        return <>
                            <Link to='/menu' state={{ data: data }}>
                                <div className="max-w-xs rounded-xl overflow-hidden shadow-sm mt-12">
                                    <img className="w-full rounded-2xl h-60" src={require(`../images/${data.restaurantImage}`)} alt="Restaurant Image" />
                                    <div className="py-4">
                                        <div className='flex justify-between items-center'>
                                            <div className="font-semibold text-xl mb-2">{data.restaurantName}</div>
                                            <div className={`text-white font-semibold text-base rounded-md p-1 ${data.restaurantRating < 4.5 ? `bg-green-600` : `bg-green-900`}`}>
                                                {data.restaurantRating}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </>
                    })}
                </div>}
        </div>
    )
}

export default Restaurant