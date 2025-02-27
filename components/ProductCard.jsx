import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {

    const { currency, router,addToCart } = useAppContext()

    return (
        <div
            
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer bg-gray-100 rounded-md border-2 p-1"
        >
            <div onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}>
            <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
                    width={800}
                    height={800}
                />
            </div>

            <p className="md:text-base text-center font-medium pt-2 w-full truncate">{product.name}</p>
            {/* <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate overflow-hidden">Click to see product details</p> */}
            </div>

            <div className="flex items-end justify-between w-full mt-1  p-3 rounded-md">
                <p className="text-base font-medium">{currency}{product.offerPrice? product.offerPrice : product.price}</p>
                <button onClick={() => { addToCart(product._id); router.push('/cart') }} 
                className=" max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-gray-200 transition">
                    Buy now
                </button>
            </div>
        </div>
    )
}

export default ProductCard