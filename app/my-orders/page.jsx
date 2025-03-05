'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { assets } from "@/assets/assets";

const MyOrders = () => {

    const { products, currency, getToken, user } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const updateOrder = async (_id, nextStatus) => {
        try {
            setOrders(prevOrders =>
                prevOrders.map((order) => order._id === _id ? {
                    ...order, status: nextStatus
                } : order)
            )
            const token = getToken()
            const { data } = await axios.post('/api/order/update', { _id, nextStatus }, { headers: { Authorization: `Bearer ${token}` } })


            if (data.success) {
                toast.success("Successfully Updated")
            }
            else {
                toast.error("Something Went Wrong")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const fetchOrders = async () => {

        try {
            const token = await getToken()

            const { data } = await axios.get('/api/order/list', { headers: { Authorization: `Bearer ${token}` } })
            console.log(data)
            if (data.success) {
                setOrders(data.orders.reverse())
                setLoading(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchOrders();
        }

    }, [user]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-center items-center px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                <div className="space-y-5">
                    <h2 className="text-lg font-medium mt-6">My Orders</h2>
                    {loading ? <Loading /> : (<div className="max-w-[72rem] border-t border-gray-300 text-sm">
                        {orders.map((order, index) => {
                            return (
                                <div key={index}
                                    className={`flex flex-col md:flex-row gap-10 justify-between items-center p-5 border-2 mb-3 rounded-md border-gray-300 ${order.status === 'Delivered' ? 'border-green-200' : order.status === 'Cancelled' ? 'border-red-200' : ''}`}>
                                    <div className="flex flex-col gap-3">
                                        {order.items.map(((item, index) => {
                                            const preproduct = products.find(preproduct => preproduct._id === item.product);
                                            return (
                                                <div key={index} className="flex flex-row gap-4 max-w-80">
                                                    <Image
                                                        className="max-w-16 max-h-16 object-cover"
                                                        src={assets.box_icon}
                                                        alt="box_icon"
                                                    />
                                                    <div className="flex flex-col gap-3">
                                                        <span className="font-medium text-base md:max-w-[8.5rem]">
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
                                    <div>
                                        <p >
                                            <span className="font-medium">{order.address.fullName}</span>
                                            <br />
                                            <span className="">{order.address.area}</span>
                                            <br />
                                            <span>{`${order.address.city}, ${order.address.region}`}</span>
                                            <br />
                                            <span>{order.address.phoneNumber}</span>
                                            <br />
                                            <span>Order Id:</span>
                                            <span className="text-md font-bold">{order._id}</span>
                                        </p>
                                    </div>
                                    <p className="font-medium ">{currency}{order.amount}</p>
                                    <div>
                                        <p className="flex flex-col my0-auto">
                                            <span>Payment Method : COD</span>
                                            <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                            <span>Status: <span className={`${order.status === 'Delivered' ? 'text-green-500' : ''} ml-1`}>{order.status}</span></span>
                                        </p>
                                    </div>
                                    {
                                        order.status !== 'Delivered' && order.status !== 'Order Processed' && order.status !== 'Order Shipped' ? (
                                            order.status === 'Cancelled' ? (<button
                                                onClick={() => {
                                                    toast.error("Order Already Cancelled")
                                                }}
                                                className="p-2 w-32 text-gray-300 bg-white border-2 border-gray-300 rounded-md h-12 "
                                            >
                                                Cancelled
                                            </button>) : (
                                                <button
                                                    onClick={() => {
                                                        const nextStatus = 'Cancelled'
                                                        updateOrder(order._id, nextStatus);
                                                    }}
                                                    className="p-2 w-32 h-12 text-red-500 bg-white border-2 border-red-500 rounded-md hover:bg-red-500 hover:text-white transition active:scale-[0.98]"
                                                >
                                                    Cancel Order
                                                </button>
                                            )
                                        ) : (<button
                                            onClick={() => {
                                                toast.success(`Order Already ${order.status == 'Order Processed' ? "Processed" : order.status === 'Order Shipped' ? "Shipped" : "Delivered"}`)
                                            }}
                                            className="p-2 w-32 h-12 text-gray-300 bg-white border-2 border-gray-300 rounded-md "
                                        >
                                            {order.status == 'Order Processed' ? "Processed" : order.status === 'Order Shipped' ? "Shipped" : "Delivered"}
                                        </button>)
                                    }
                                </div>)

                        })}

                    </div>)}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;