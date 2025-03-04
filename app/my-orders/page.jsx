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
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                <div className="space-y-5">
                    <h2 className="text-lg font-medium mt-6">My Orders</h2>
                    {loading ? <Loading /> : (<div className="max-w-5xl border-t border-gray-300 text-sm">
                        {orders.map((order, index) => {
                            return (
                                <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">
                                    <div className="flex flex-col gap-3">
                                        {order.items.map(((item, index) => {
                                            const preproduct = products.find(preproduct => preproduct._id === item.product);
                                            return (
                                                <div key={index} className="flex-1 flex gap-5 max-w-80">
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
                                            <br/>
                                            <span>Order Id:</span>
                                            <span className="text-md font-bold">{order._id}</span>
                                        </p>
                                    </div>
                                    <p className="font-medium ">{currency}{order.amount}</p>
                                    <div>
                                        <p className="flex flex-col my0-auto">
                                            <span>Payment Method : COD</span>
                                            <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                            <span>Status: <span className={`${order.status === 'Delivered' ? 'text-green-500':''} ml-1`}>{order.status}</span></span>
                                        </p>
                                    </div>
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