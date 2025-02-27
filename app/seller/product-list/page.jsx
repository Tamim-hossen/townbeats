"use client"
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const ProductList = () => {

  const { router,getToken } = useAppContext()
  const {user} = useUser();


  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken()

      const {data} = await axios.get('/api/product/seller-list',{headers:{Authorization: `Bearer ${token}`}})
      
      if(data.success){
        setProducts(data.products)
       setLoading(false)
      }
      else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if(user){
      fetchSellerProduct();
    }
    
  }, [user])

  const handleAddFeature = async (product) => {
    try {

      const featureData = {
        _id: product._id,
        name: product.name,
        description: product.description,
        image: product.image,
      };
      console.log(featureData)
      const token = await getToken();
            const {data} = await axios.post('/api/featuredProduct/create',{featureData},{headers: {Authorization:`Bearer ${token}`}})
            if(data.success){
                toast.success(data.message)
                router.push('/')
            }
            else{
                toast.error(data.message)
            }
    } catch (error) {
      toast.error(error.message);
    }
  };
  

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Product</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className=" table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="w-2/5 md:w-2/6 px-4 py-3 font-medium truncate">Product</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                <th className="px-4 py-3 font-medium truncate">
                  Price
                </th>
                <th className="px-4 py-3 font-medium truncate">
                  Offer Price
                </th>
                <th className="px-4 py-3 font-medium truncate ">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product, index) => (
                <tr key={index} className="border-t border-gray-600/20">
                  <td className="md:px-4 pl-2 py-2 space-x-2 truncate">
                    <div className="w-[100%] h-auto rounded p-2">
                      <Image
                        src={product.image[0]}
                        alt="product Image"
                        className="w-16 h-auto"
                        width={1280}
                        height={700}
                      />
                    </div>
                    <span className="truncate w-full font-bold md:text-base">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
                  <td className="px-4 py-3">৳{product.price}</td>
                  <td className="px-4 py-3">৳{product.offerPrice}</td>
                  <td className="px-4 py-3 mt-3 flex flex-col gap-1">
                    <button onClick={() => router.push(`/product/${product._id}`)} className="flex items-center justify-center gap-1 px-1 md:px-3.5 py-2 bg-gray-800 text-white rounded-md">
                      <span className="hidden md:block">Visit</span>
                      <Image
                        className="h-3.5 md:h-2.5"
                        src={assets.redirect_icon}
                        alt="redirect_icon"
                      />
                    </button>
                    <button onClick={async () => {
                      handleAddFeature(product);
                    }
                      } className="flex items-center justify-center gap-1 px-1.5 md:px-3.5 py-2 bg-gray-800 text-white rounded-md active:scale-[0.98]">
                      <Image
                        className="h-3.5 md:h-2.5 w-auto"
                        src={assets.add_icon_2}
                        alt="redirect_icon"
                      />
                      <span className="hidden md:block">Feature</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
    </div>
  );
};

export default ProductList;