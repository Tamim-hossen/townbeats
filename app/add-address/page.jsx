'use client'
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AddAddress = () => {

    const { getToken, router } = useAppContext()

    const [address, setAddress] = useState({
        fullName: '',
        phoneNumber: '',
        area: '',
        city: '',
        region: '',
    })

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const token = await getToken();
            const { data } = await axios.post('/api/user/addAddress', { address }, { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                toast.success(data.message)
                router.push('/cart')
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between items-center">
                <form onSubmit={onSubmitHandler} className="w-full">
                    <p className="text-2xl md:text-3xl text-gray-500">
                        Add Shipping <span className="font-semibold text-black">Address</span>
                    </p>
                    <div className="space-y-3 max-w-sm mt-10">
                        <input
                            className="px-2 py-2.5 focus:border-black transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Full name"
                            required
                            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                            value={address.fullName}
                        />
                        <input
                            className="px-2 py-2.5 focus:border-black transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Phone number"
                            required
                            onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                            value={address.phoneNumber}
                        />

                        <textarea
                            className="px-2 py-2.5 focus:border-black transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
                            type="text"
                            rows={4}
                            placeholder="Address (House no, Street no, Area)"
                            required
                            onChange={(e) => setAddress({ ...address, area: e.target.value })}
                            value={address.area}
                        ></textarea>
                        <div className="flex space-x-3">
                            <input
                                className="px-2 py-2.5 focus:border-black transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                                type="text"
                                placeholder="City/District/Town"
                                required
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                value={address.city}
                            />
                            <div className="flex flex-col gap-1 w-32">
                                <label className="text-base font-medium" htmlFor="region">
                                    Region
                                </label>
                                <select
                                    id="region"
                                    className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                                    onChange={(e) => setAddress({ ...address, region: e.target.value })}
                                    value={address.region}
                                    required
                                >
                                    <option>Select</option>
                                    <option value="Dhaka">Dhaka</option>
                                    <option value="Chittagong">Chittagong</option>
                                    <option value="Barishal">Barishal</option>
                                    <option value="Khulna">Khulna</option>
                                    <option value="Mymensingh">Mymensingh</option>
                                    <option value="Rajshahi">Rajshahi</option>
                                    <option value="Rangpur">Rangpur</option>
                                    <option value="Sylhet">Sylhet</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="max-w-sm w-full mt-6 bg-white text-black border-2 border-black py-3 hover:bg-black hover:text-white transition-all active:scale-[0.98] uppercase">
                        Save address
                    </button>
                </form>
                <Image
                    className="md:mr-16 mt-24 md:mt-24 w-72 h-72"
                    src={assets.my_location_image}
                    alt="my_location_image"
                />
            </div>
            <Footer />
        </>
    );
};

export default AddAddress;