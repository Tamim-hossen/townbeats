'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {

    const { products, currency, getToken, user } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const updateOrder = async (_id) =>{
        try {
            setOrders(prevOrders => 
                prevOrders.map((order) => order._id === _id ? {...order, status : order.status=== 'Order Placed' ? 'Order Confirmed': order.status=== 'Order Confirmed' ? 'Order Processed' :
                    order.status=== 'Order Processed' ? 'Order Shipped' : 'Delivered'
                 } : order)
            )
            const token= getToken()
            const {data} = await axios.post('/api/order/update',{_id},{headers: {Authorization: `Bearer ${token}`}})
            
            if(data.success){
                toast.success("Successfully Updated")
            }
            else{
                toast.error("Something Went Wrong")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchSellerOrders = async () => {
        try {
            const token = await getToken()

            const { data } = await axios.get('/api/order/sellerOrders', { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setOrders(data.orders.reverse())
                setLoading(false)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchSellerOrders();
        }

    }, [user]);

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <h2 className="text-lg font-medium">Orders</h2>
                <div className="max-w-6xl rounded-md">
                    {orders.map((order, index) => {
                        return (
                            <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">

                                <div className="flex flex-col gap-3 border-b-2 pb-2 md:border-b-0 md:pb-0 md:border-r-2 md:pr-2">
                                    {order.items.map(((item, index) => {
                                        const preproduct = products.find(preproduct => preproduct._id === item.product);
                                        return (
                                            <div key={index} className="flex-1 flex gap-5 mb-3  max-w-80">
                                                <Image
                                                    className="max-w-16 max-h-16 object-cover"
                                                    src={assets.box_icon}
                                                    alt="box_icon"
                                                />
                                                <div className="flex flex-col gap-3 md:max-w-32 pr-2 ">
                                                    <span className="font-medium text-base">
                                                        {preproduct.name}
                                                    </span>
                                                    {item.quantity.map((quantity, index) => {
                                                        return (
                                                            <div key={index} className="flex flex-row gap-2">
                                                                <span>Item :</span>
                                                                <p style={{ backgroundColor: `${preproduct.colors.length === 1 ? "" : quantity.color}` }}
                                                                    className={`h-4 ${preproduct.colors.length === 1 ? 'w-8' : 'w-4'}`}>
                                                                    {preproduct.colors.length === 1 ? "Basic" : ""}
                                                                </p>
                                                                <p>{quantity.size}</p>
                                                                <p>x {quantity.quantity}</p>
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }))}
                                </div>
                                <div className="border-b-2 pb-2 md:border-b-0 md:pb-0 md:border-r-2 md:pr-2 flex justify-center items-center">
                                    <div>
                                        <span className="font-medium">{order.address.fullName}</span>
                                        <br />
                                        <span className="">{order.address.area}</span>
                                        <br />
                                        <span>{`${order.address.city}, ${order.address.region}`}</span>
                                        <br />
                                        <span>{order.address.phoneNumber}</span>
                                        <div className="mt-2">
                                            <p>Order Id:</p>
                                            <p className="text-md font-bold">{order._id}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="font-medium flex justify-center items-center border-b-2 pb-2 md:border-r-2 md:pr-2 md:border-b-0 md:pb-0">{currency}{order.amount}</p>
                                <div className="md:border-r-2 md:pr-2 border-b-2 pb-2 flex justify-center items-center md:border-b-0 md:pb-0">
                                    <div className="flex flex-col my0-auto">
                                        <span>Payment Method : COD</span>
                                        <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                        <span>Status:<span className={`${order.status === 'Delivered' ? 'text-green-500':''} ml-1`}>{order.status}</span> </span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center items-center">
                                   {order.status === 'Delivered' ? ( <button onClick={() => {toast.success("Already Delivered")}} 
                                    className={` text-gray-300 cursor-not-allowed border-gray-300"
                                    p-2 bg-white border-2 border-Gray rounded-md transition active:scale-[0.98]`}>
                                        Update Status</button>) : ( <button onClick={() => {updateOrder(order._id) ; }} 
                                    className={`p-2 bg-white border-2 border-black rounded-md hover:bg-black hover:text-white transition active:scale-[0.98]`}>
                                        Update Status</button>)}
                                </div>
                            </div>

                        )
                    })}
                </div>
            </div>}

        </div>
    );
};

export default Orders;