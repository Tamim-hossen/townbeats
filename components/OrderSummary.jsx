'use client'
import Loading from "./Loading";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {
 const [loading,setLoading] = useState(false)
  const { currency, router, getCartCount, getCartAmount, user, updateProduct, getToken, cartItems, setCartItems } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [state, setState] = useState("Dhaka")
  const [userAddresses, setUserAddresses] = useState([]);
  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/user/getAddress', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        setUserAddresses(data.addresses)
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0])
          setState(data.addresses[0].region)
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setState(address.region)
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    try {
      if (!selectedAddress) {
        setLoading(false)
        return toast.error('Please Select an Address')

      }

      let cartItemsArray = Object.keys(cartItems).map((key) => ({ product: key, quantity: cartItems[key] }))
      cartItemsArray = cartItemsArray.filter(item =>
        item.quantity.filter(amount => amount.quantity > 0).length > 0
      );

      if (cartItemsArray.length === 0) {
        return toast.error('Cart is Empty')
        setLoading(false)
      }

      const amount = Number(await getCartAmount())
      const token = await getToken()
      setLoading(true)
      await updateProduct(cartItems)
      const { data } = await axios.post('/api/order/create', {
        address: selectedAddress._id,
        address_region: state,
        items: cartItemsArray,
        amountsent: amount,
      }, { headers: { Authorization: `Bearer ${token}` } })


      if (data.success) {
        toast.success(data.message)
        setCartItems({})
        router.push('/order-placed')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user])

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      {loading? <Loading/> : 
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.region}`
                  : "Select Address"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.region}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-black border-2 border-black text-white px-9 py-2 hover:bg-white hover:text-black transition">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">{getCartCount()} Items</p>
          </div>
          <div className="flex justify-between text-base font-medium">
            <p className=" text-gray-600">Total Price</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <h6 className="text-gray-600">Shipping Fee<p className="text-sm">{state === "Dhaka" ? "(Inside Dhaka)" : "(Outside Dhaka)"}</p></h6>
            <h6 className="font-medium text-gray-800">{state === "Dhaka" ? "৳80" : "৳150"}</h6>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{state === "Dhaka" ? 80 + getCartAmount() : 150 + getCartAmount()}</p>
          </div>
        </div>
      </div>}

      {loading? <p className="w-full bg-gray-300 text-gray-500 text-center border-2 border-gray-500 py-3 mt-5 transition-all">
        Please wait
      </p>:<button onClick={createOrder} className="w-full bg-white text-black border-2 border-black py-3 mt-5 hover:bg-black hover:text-white active:scale-[0.98] transition">
        Place Order
      </button>}
    </div>
  );
};

export default OrderSummary;