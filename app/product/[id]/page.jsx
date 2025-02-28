"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import { useUser } from "@clerk/nextjs";

const Product = () => {

    const { id } = useParams();

    const { products, router, addToCart,user } = useAppContext()

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);

    const fetchProductData = async () => {
        const product = products.find(product => product._id === id);
        setProductData(product);
    }

    useEffect(() => {
        fetchProductData();
    }, [id, products.length])

    return productData ? (<>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16">
                    <div className="flex gap-1 justify-center items-center">
                        <button onClick={() => mainImage ? mainImage===productData.image[0] ? 
                        setMainImage(productData.image[3]) :mainImage===productData.image[1] ? 
                        setMainImage(productData.image[0]):mainImage===productData.image[2] ? 
                        setMainImage(productData.image[1]):mainImage===productData.image[3] ? 
                        setMainImage(productData.image[2]): "" : "" }><Image src ={assets.decrease_arrow} className="w-[30px] h-[30px] hover:scale-[1.05]" alt="Decrease Arrow"/></button>
                    <div className="rounded-lg overflow-hidden flex justify-center items-center transition bg-gray-500/10 mb-4 w-[25rem] h-[30rem] ">
                        <Image
                            src={mainImage || productData.image[0]}
                            alt="alt"
                            className="h-full w-full object-cover mix-blend-multiply"
                            width={1280}
                            height={720}
                        />
                    </div>
                    <button onClick={() => mainImage ? mainImage===productData.image[0] ? 
                        setMainImage(productData.image[1]) :mainImage===productData.image[1] ? 
                        setMainImage(productData.image[2]):mainImage===productData.image[2] ? 
                        setMainImage(productData.image[3]):mainImage===productData.image[3] ? 
                        setMainImage(productData.image[0]): "" : setMainImage(productData.image[1]) }>
                        <Image src ={assets.increase_arrow} className="w-[30px] h-[30px] hover:scale-[1.05] active:scale-[0.98]" alt="Decrease Arrow"/></button>
                    </div>
                    

                    <div className="grid grid-cols-4 gap-4">
                        {productData.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(image)}
                                className="cursor-pointer rounded-lg flex items-center justify-center "
                            >
                                <Image
                                    src={image}
                                    alt="alt"
                                    className=" object-cover mix-blend-multiply w-[5rem] h-[6rem] rounded-md"
                                    width={1280}
                                    height={720}
                                />
                            </div>

                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                        {productData.name}
                    </h1>
                    <p className="text-sm mt-4">Product Description:</p>
                    <p className="text-gray-600 mt-3">
                        {productData.description}
                    </p>
                    <p className="text-3xl font-medium mt-6">
                    ৳{productData.offerPrice ? productData.offerPrice : productData.price }
                        <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                        {productData.offerPrice ? `৳ ${productData.price}`: ""}
                        </span>
                    </p>
                    <hr className="bg-gray-600 my-6" />
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full max-w-72">
                            <tbody>
                                <tr>
                                    <td className="text-gray-600 font-medium">Brand</td>
                                    <td className="text-gray-800/50 ">Town-Beats</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Color</td>
                                    <td className="text-gray-800/50 ">Multi</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Category</td>
                                    <td className="text-gray-800/50">
                                        {productData.category}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center mt-10 gap-4">
                        {user? <button onClick={() => addToCart(productData._id)} className="w-full py-3.5 bg-black border-2 border-black text-white hover:bg-gray-300 hover:text-black ease-in-out transition">
                            Add to Cart
                        </button>:<p className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition text-center">Log in to add to cart</p>}
                        <button onClick={() => { addToCart(productData._id); router.push('/cart') }} className="w-full py-3.5 bg-white text-black hover:bg-gray-300 border-2 border-black ease-in-out transition">
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">Other <span className="font-medium text-black">Products</span></p>
                    <div className="w-28 h-0.5 bg-black mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                    {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                    See more
                </button>
            </div>
        </div>
        <Footer />
    </>
    ) : <Loading />
};

export default Product;