'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useEffect, useState } from "react";

const AllProducts = () => {

    const { products } = useAppContext();
    const [search, setSearch] = useState('');
    const [searchBar, setSearchBar] = useState(false)

    const filteredProducts = products.filter((product) => {
        return product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase());
    });


    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center transition-all px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-center pt-12">
                    <p className="text-2xl font-medium">All products</p>
                    <div className="w-24 h-0.5 mt-2 bg-gray-800 rounded-full"></div>
                    <div onClick={() => setSearchBar((prev) => !prev)}><Image className="w-4 h-4 hover:scale-110 m-3 cursor-pointer"  src={assets.search_icon} alt="search icon" /></div>
                </div>
                <div
                    className={`mt-5 flex flex-row md:gap-3 md:justify-center justify-start md:items-center transform transition-all duration-500 ease-in-out ${searchBar ? 'translate-y-0 opacity-100' : '-translate-y-16 scale-0 opacity-0'
                        }`}
                >
                    <input
                        type="text"
                        value={search}
                        placeholder="Search"
                        className={`border-2 rounded-md md:w-96 w-64 pl-2 p-1 focus:border-blue-500 active:border-red-500 hover:border-gray-400 transition-all duration-200 ${searchBar ? "" : 'cursor-default'}`}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Image
                        className="w-4 h-4 hover:scale-110 m-3"
                        src={assets.search_icon}
                        alt="search icon"
                    />
                </div>

                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full duration-500 transition-all ${searchBar ? 'translate-y-0 ' : '-translate-y-16'
                        }`}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))
                    ) : search === '' ? (
                        products.map((product, index) => <ProductCard key={index} product={product} />)
                    ) : <p className="text-center text-lg">No available products</p>}

                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
