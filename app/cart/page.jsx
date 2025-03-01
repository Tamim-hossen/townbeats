'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const Cart = () => {

  const { products, router, CartEntryDelete, cartItems, updateCartQuantity, getCartCount } = useAppContext();

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-black">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">{getCartCount()} Items</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 text-sm md:text-md font-medium">
                    Product Details
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 text-sm md:text-md font-medium">
                    Color|Size
                  </th>

                  <th className="pb-6 md:px-4 px-1 text-gray-600 text-sm md:text-md font-medium flex justify-center md:justify-start md:pl-8">
                    <p>Quantity</p>
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 text-sm md:text-md font-medium">
                    Price
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 text-sm md:text-md font-medium">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="overflow-hidden">
                {Object.keys(cartItems).map((itemId) => {
                  const preproduct = products.find(preproduct => preproduct._id === itemId);
                  const product = { ...preproduct, image: preproduct.image.slice(0, 4), colors: preproduct.colors.map((col) => JSON.parse(col)) }
                  const totalQuantity = Object.values(cartItems)
                    .flat()
                    .reduce((acc, item) => acc + item.quantity, 0);
                  cartItems[itemId].map((item, index) => {
                    const { color, quantity, size } = item;
                  })

                  if (!product || cartItems <= 0) return null;

                  return (
                    <tr key={itemId} className="">
                      <td className="flex md:flex-row flex-col items-center gap-3 py-4 md:px-4 px-1">

                        <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                          <Image
                            src={product.image[0]}
                            alt={product.name}
                            className="w-16 h-auto object-cover mix-blend-multiply"
                            width={1280}
                            height={720}
                          />
                        </div>

                        <div className="text-sm block">
                          <p className="text-gray-800">{product.name}</p>
                          <p><button
                            className="text-xs text-red-600 mt-1"
                            onClick={() => CartEntryDelete(itemId, 0)}
                          >
                            Remove
                          </button></p>
                        </div>

                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        {cartItems[itemId].map((item, index) => {
                          const { color, quantity, size } = item;
                          return (
                            <div className="flex flex-row gap-2" key={index}>
                              <p
                                className={`w-6 h-6 pl-[0.4rem] text-white items-center rounded-md mb-2`}
                                style={{ backgroundColor: color }}
                              />
                              <p className="pointer-events-none">{size} </p>
                            </div>
                          );
                        })}
                      </td>
                      <td className="py-4 md:px-4 px-2">
                        {cartItems[itemId].map((item, index) => {
                          const { color, quantity, size } = item;
                          const colorIndex = product.colors.find((colorObj) => colorObj.currentColor === color);
                          const availableStock = colorIndex ? colorIndex[size] : 0;
                          return (
                            <div key={index} className="mb-2 md:gap-2 pl-3 gap-3 flex items-center justify-end max-w-16">
                              <button onClick={() => updateCartQuantity(product._id, color, size, quantity - 1)}>
                                <Image
                                  src={assets.decrease_arrow}
                                  alt="decrease_arrow"
                                  className="w-4 h-4 cursor-pointer"
                                />
                              </button>

                              <span
                                className="w-6 md:w-8 text-center pointer-events-none"
                              >{quantity}</span>
                              {availableStock > quantity ? 
                              <button onClick={() => updateCartQuantity(product._id, color, size, quantity + 1)}>
                                <Image
                                  src={assets.increase_arrow}
                                  alt="increase_arrow"
                                  className="w-4 h-4 cursor-pointer"
                                />
                              </button> : <button onClick={()=> {toast.error(`Sorry!! Max available stock at the moment is ${availableStock}`) }}>
                                <Image
                                  src={assets.increase_arrow}
                                  alt="increase_arrow"
                                  className="w-4 h-4 cursor-not-allowed color-black"
                                />
                              </button> }
                              
                            </div>
                          );
                        })}


                      </td>

                      <td className="py-4 md:px-4 px-1 text-gray-600">৳{product.offerPrice ? product.offerPrice : product.price}</td>

                      <td className="py-4 md:px-4 px-1 text-gray-600 col-span-4"><p>৳{(product.offerPrice || product.price * totalQuantity)} </p></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>
          <button onClick={() => router.push('/all-products')} className="group flex items-center mt-6 gap-2 text-black">
            <Image
              className="group-hover:-translate-x-1 h-3 w-auto transition"
              src={assets.arrow_right_icon_colored}
              alt="arrow_right_icon_colored"
            />
            Continue Shopping
          </button>
        </div>
        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;
