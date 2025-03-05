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
import toast from "react-hot-toast";

const Product = () => {

    const { id } = useParams();

    const { products, addToCart, router, user, getToken } = useAppContext()

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [selectedColor, setSelectedColor] = useState("")
    const [selectedSize, setSelectedSize] = useState();
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const fetchProductData = async () => {
        const product = products.find(product => product._id === id);
        if (product) {
            setProductData({ ...product, image: product.image.slice(0, 4), colors: product.colors.map((col) => JSON.parse(col)) });
            // const colorchange = JSON.parse(product.colors[0])
            setSelectedColor(product.colors.length > 1 ? "" : JSON.parse(product.colors[0]))
        }


    }

    const handleAddCart = async (product) => {
        try {
            if (selectedColor, selectedSize)
                addToCart(productData._id, selectedColor.currentColor, selectedSize,selectedQuantity)
            setSelectedColor(product.colors.length > 1 ? "" : product.colors[0])
            setSelectedSize("")

            // const { description,date,colors,userId, ...rest } = product;  
            // const updatedProduct = { ...rest, selectedColor,selectedSize };
            // console.log(updatedProduct);


            // const token = await getToken();
            // const {data} = await axios.post('/api/cart/add',{updatedProduct},{headers: {Authorization:`Bearer ${token}`}})
            //     if(data.success){
            //         toast.success(data.message)
            //         addToCart(productData._id,selectedColor,selectedSize)
            //     }
            //     else{
            //         toast.error(data.message)
            //     }
        } catch (error) {
            toast.error(error.message);
        }
    };


    useEffect(() => {
        fetchProductData();
    }, [id, products.length])

    return productData ? (<>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16">
                    <div className="flex gap-1 justify-center items-center">
                        <button onClick={() => mainImage ? mainImage === productData.image[0] ?
                            setMainImage(productData.image[3]) : mainImage === productData.image[1] ?
                                setMainImage(productData.image[0]) : mainImage === productData.image[2] ?
                                    setMainImage(productData.image[1]) : mainImage === productData.image[3] ?
                                        setMainImage(productData.image[2]) : "" : ""}><Image src={assets.decrease_arrow} className="w-[30px] h-[30px] hover:scale-[1.05]" alt="Decrease Arrow" /></button>
                        <div className="rounded-lg overflow-hidden flex justify-center items-center transition bg-gray-500/10 mb-4 xl:w-[25rem] w-[40rem]  h-[30rem] ">
                            <Image
                                src={mainImage || productData.image[0]}
                                alt="alt"
                                className="h-full w-full object-cover mix-blend-multiply"
                                width={1280}
                                height={720}
                            />
                        </div>
                        <button onClick={() => mainImage ? mainImage === productData.image[0] ?
                            setMainImage(productData.image[1]) : mainImage === productData.image[1] ?
                                setMainImage(productData.image[2]) : mainImage === productData.image[2] ?
                                    setMainImage(productData.image[3]) : mainImage === productData.image[3] ?
                                        setMainImage(productData.image[0]) : "" : setMainImage(productData.image[1])}>
                            <Image src={assets.increase_arrow} className="w-[30px] h-[30px] hover:scale-[1.05] active:scale-[0.98]" alt="Decrease Arrow" /></button>
                    </div>


                    <div className={`flex justify-center gap-4`}>
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
                        ৳{productData.offerPrice ? productData.offerPrice : productData.price}
                        <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                            {productData.offerPrice ? `৳ ${productData.price}` : ""}
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
                                    <td className="text-gray-800/50 ">{productData.colors.length > 1 ? "Multi" : "Basic"}</td>
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
                    <div className={`mt-4 ${productData.colors.length === 0 ? "hidden" : "block"} flex flex-col`}>
                        {productData.colors.length > 1 ? <p>Choose Color, Size and Quantity:</p> : <p>Choose Size:</p>}
                        <ul className="mt-4 flex flex-row gap-2">
                            {productData.colors.map((col, index) => (
                                <div key={index} >

                                    {productData.colors.length > 1 ? <li onClick={() => setSelectedColor(col)}
                                        className={`w-6 h-6 pl-[0.4rem] text-white items-center rounded-md cursor-pointer ${col === selectedColor.currentColor ? 'border-2 border-gray-800 ' : ""}`}
                                        style={{ backgroundColor: col.currentColor }}
                                    > {col.currentColor === selectedColor.currentColor ? '✓' : ""} </li> : ""}
                                    <div className="flex flex-row gap-3">
                                    </div>
                                </div>
                            ))}

                        </ul>
                        <div className={`flex flex-row gap-3 transform transition-all duration-500 ease-in-out ${selectedColor ? 'translate-y-0 opacity-100' : '-translate-y-10 -translate-x-64 scale-0 cursor-default opacity-0'
                            }`}>
                            <ul>
                                {selectedColor.XXL > 0 ? <li onClick={() => { setSelectedSize('XXL'); setSelectedQuantity(1) }}
                                    className={`mt-3 w-10 text-center cursor-pointer border-2 border-black p-1 rounded-md hover:bg-black
                                             hover:text-white transition ease-in-out active:scale-[0.96]
                             ${selectedSize === 'XXL' ? 'bg-black text-white' : ''}`}>2XL</li> :
                                    <li onClick={() => toast.error('Size is not available')} className="mt-3 w-10 text-center cursor-not-allowed border-2  border-gray-300 text-gray-500 p-1 rounded-md">2XL</li>}
                            </ul>
                            <ul>
                                {selectedColor.XL > 0 ? <li onClick={() => { setSelectedSize('XL'); setSelectedQuantity(1) }}
                                    className={`mt-3 w-10 text-center cursor-pointer border-2 border-black p-1 rounded-md hover:bg-black
                                             hover:text-white transition ease-in-out active:scale-[0.96]
                             ${selectedSize === 'XL' ? 'bg-black text-white' : ''}`}>XL</li> :
                                    <li onClick={() => toast.error('Size is not available')} className="mt-3 w-10 text-center cursor-not-allowed border-2  border-gray-300 text-gray-500 p-1 rounded-md">XL</li>}
                            </ul>
                            <ul>
                                {selectedColor.L > 0 ? <li onClick={() => { setSelectedSize('L'); setSelectedQuantity(1) }}
                                    className={`mt-3 w-10 text-center cursor-pointer border-2 border-black p-1 rounded-md hover:bg-black
                                             hover:text-white transition ease-in-out active:scale-[0.96]
                             ${selectedSize === 'L' ? 'bg-black text-white' : ''}`}>L</li> :
                                    <li onClick={() => toast.error('Size is not available')} className="mt-3 w-10 text-center cursor-not-allowed border-2  border-gray-300 text-gray-500 p-1 rounded-md">L</li>}
                            </ul>
                            <ul>
                                {selectedColor.M > 0 ? <li onClick={() => { setSelectedSize('M'); setSelectedQuantity(1) }}
                                    className={`mt-3 w-10 text-center cursor-pointer border-2 border-black p-1 rounded-md hover:bg-black
                                             hover:text-white transition ease-in-out active:scale-[0.96]
                             ${selectedSize === 'M' ? 'bg-black text-white' : ''}`}>M</li> :
                                    <li onClick={() => toast.error('Size is not available')} className="mt-3 w-10 text-center cursor-not-allowed border-2  border-gray-300 text-gray-500 p-1 rounded-md">M</li>}
                            </ul>
                        </div>
                        <div className={`flex flex-row gap-3 mt-5 transform transition-all duration-500 ease-in-out ${selectedSize ? 'translate-y-0 opacity-100' : '-translate-y-10 -translate-x-64 scale-0 cursor-default opacity-0'
                            }`}>
                            <div className=" md:gap-2 pl-3 grid grid-flow-col grid-cols-none max-w-32">
                                {selectedQuantity > 1 ? <button onClick={() => setSelectedQuantity((prev) => prev - 1)}>
                                    <Image
                                        src={assets.decrease_arrow}
                                        alt="decrease_arrow"
                                        className="w-4 h-4  cursor-pointer"
                                    />
                                </button>:<button onClick={()=>toast.error('Minimum Selectable Quantity in 1')}>
                                    <Image
                                        src={assets.decrease_arrow}
                                        alt="decrease_arrow"
                                        className="w-4 h-4  cursor-not-allowed"
                                    />
                                </button>}
                                <div className="w-12  h-8 text-center flex items-center justify-center pointer-events-none"><span>
                                    {selectedQuantity}
                                </span></div>

                                {selectedQuantity < selectedColor[selectedSize] ?
                                    <button onClick={() => setSelectedQuantity((prev) => prev + 1)}>
                                        <Image
                                            src={assets.increase_arrow}
                                            alt="increase_arrow"
                                            className="w-4 h-4  cursor-pointer"
                                        />
                                    </button> : <button onClick={() => { toast.error(`Sorry!! Max available stock at the moment is ${selectedColor[selectedSize]}`) }}>
                                        <Image
                                            src={assets.increase_arrow}
                                            alt="increase_arrow"
                                            className="w-4 h-4  cursor-not-allowed color-black"
                                        />
                                    </button>}

                            </div>
                        </div>
                    </div>

                    <div className={`flex items-center mt-10 gap-4 transform transition-all duration-500 ease-in-out ${selectedColor ? 'translate-y-0' : '-translate-y-10'}`}>
                        {user ? selectedSize ? <button onClick={() => handleAddCart(productData)} className="w-full py-3.5 bg-black border-2 border-black text-white hover:bg-gray-300 hover:text-black ease-in-out transition">
                            Add to Cart
                        </button>
                            : <p className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition text-center">Select a Size</p> :
                            <p className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition text-center">Log in to add to cart</p>}
                        <button onClick={() => {
                            if (selectedSize) {
                                handleAddCart(productData);
                                router.push('/cart');
                            } else {
                                toast.error("Select a size");
                            }
                        }}
                            className="w-full py-3.5 bg-white text-black hover:bg-gray-300 border-2 border-black ease-in-out transition">
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