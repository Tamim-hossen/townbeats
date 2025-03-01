'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const {user, isLoading} = useUser();
    const {getToken} = useAuth()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [featuredproducts,setFeaturedProducts] = useState([])

    const fetchProductData = async () => {
        try {
            const {data} = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const fetchFeaturedProductData = async () => {
        try {
            const {data} = await axios.get('/api/featuredProduct/list')
            if(data.success){
                setFeaturedProducts(data.featuredProducts.reverse())
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async () => {
        try{
            if(user && user.publicMetadata && user.publicMetadata.role === 'admin'){
                setIsSeller(true)
            }
            const token = await getToken();


            const {data} = await axios.get('/api/user/data', {headers: {Authorization: `Bearer ${token}`}})
            if(data.success){
                setUserData(data.user)
                setCartItems(data.user.cartItems)
            } else {
                toast.error(data.message)
            }
        } catch(error){
            toast.error(error.message)
        }
    }

    const addToCart = async (itemId, color, size) => {

        let cartData = structuredClone(cartItems);
    

        if (cartData[itemId]) {

            const existingItemIndex = cartData[itemId].findIndex(
                (item) => item.color === color && item.size === size
            );
    
            if (existingItemIndex !== -1) {

                cartData[itemId][existingItemIndex].quantity += 1;
            } else {
 
                cartData[itemId].push({ color, size, quantity: 1 });
            }
        } else {

            cartData[itemId] = [{ color, size, quantity: 1 }];
        }

        setCartItems(cartData);

    
        

        if(user){
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', {cartData},{headers: {Authorization:`Bearer ${token}`}})
                toast.success('Item Added Successfully')
            } catch (error) {
                toast.error(error.message)
            }
        }

    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)
        if(user){
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', {cartData},{headers: {Authorization:`Bearer ${token}`}})
                toast.success('Cart Updated Successfully')
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmount += (itemInfo.offerPrice===0? itemInfo.price : itemInfo.offerPrice) * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData()
    }, [])
    useEffect(() => {
        fetchFeaturedProductData()
    }, [])

    useEffect(() => {
        if(user){
            fetchUserData()
        }
        fetchUserData()
    }, [user])

    const value = {
        user,getToken,isLoading,
        currency, router,
        featuredproducts,fetchFeaturedProductData,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}