'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { NextResponse } from "next/server";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const { user, isLoading } = useUser();
    const { getToken } = useAuth()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [featuredproducts, setFeaturedProducts] = useState([])

    const fetchProductData = async () => {
        try {
            const { data } = await axios.get('/api/product/list')
            if (data.success) {
                setProducts(data.products)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const fetchFeaturedProductData = async () => {
        try {
            const { data } = await axios.get('/api/featuredProduct/list')
            if (data.success) {
                setFeaturedProducts(data.featuredProducts.reverse())
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async () => {
        try {
            if (user && user.publicMetadata && user.publicMetadata.role === 'admin') {
                setIsSeller(true)
            }
            const token = await getToken();


            const { data } = await axios.get('/api/user/data', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                setUserData(data.user)
                setCartItems(data.user.cartItems)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
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




        if (user) {
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, { headers: { Authorization: `Bearer ${token}` } })
                toast.success('Item Added Successfully')
            } catch (error) {
                toast.error(error.message)
            }
        }

    }
    const updateProduct = async () => {
        let productDataa = structuredClone(products);

        Object.keys(cartItems).forEach(key => {
            cartItems[key].forEach(item => {
                const preproduct = productDataa.find(preproduct => preproduct._id === key);

                let product = {
                    ...preproduct,
                    image: preproduct.image.slice(0, 4),
                    colors: preproduct.colors.map((col) => JSON.parse(col))
                };
                product.colors.forEach((size) => {
                    if (item.color === size.currentColor) {
                        size[item.size] -= item.quantity;
                    }
                });
                product = { ...product, colors: product.colors.map((col) => JSON.stringify(col)) };
                productDataa.forEach((itemData, index) => {
                    if (itemData._id === product._id) {
                        productDataa[index] = { ...itemData, colors: product.colors };
                    }
                });

            });
        });
        if (products) {
            try {
                const token = await getToken();
                await axios.post('/api/product/update', { Data: productDataa }, { headers: { Authorization: `Bearer ${token}` } })
                fetchProductData()
            } catch (error) {
                toast.error(error.message)
            }
        }

    }
    const CartEntryDelete = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)
        if (user) {
            try {
                const token = await getToken();
                const { response } = await axios.post('/api/cart/update', { cartData }, { headers: { Authorization: `Bearer ${token}` } })
                if (response.success) {
                    return NextResponse.json({ success: true })
                }
                else {
                    return NextResponse.json({ success: false, message: "Unable to Place Order" })
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const updateCartQuantity = async (itemId, color, size, quantity) => {

        let cartData = structuredClone(cartItems);


        if (cartData[itemId]) {

            const existingItemIndex = cartData[itemId].findIndex(
                (item) => item.color === color && item.size === size
            );

            if (existingItemIndex !== -1) {
                if (quantity === 0) {
                    cartData[itemId].splice(existingItemIndex, 1);
                }
                else {
                    cartData[itemId][existingItemIndex].quantity = quantity;

                }

            }
        }
        Object.keys(cartData).forEach((itemKey) => {
            const item = cartData[itemKey];
            const itemTotal = item.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
            if (itemTotal === 0) {
                delete cartData[itemKey];
            }
        });

        setCartItems(cartData)
        if (user) {
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, { headers: { Authorization: `Bearer ${token}` } })
                toast.success('Cart Updated Successfully')
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        Object.keys(cartItems).forEach((itemId) => {
            totalCount += cartItems[itemId].reduce((acc, item) => acc + item.quantity, 0);
        });

        return totalCount;
    }


    const getCartAmount = () => {
        let totalAmount = 0;

        Object.keys(cartItems).forEach((itemId) => {
            const preproduct = products.find(preproduct => preproduct._id === itemId);
            if (preproduct) {
                const count = cartItems[itemId].reduce((acc, item) => acc + item.quantity, 0);
                const price = preproduct.offerPrice || preproduct.price;
                totalAmount += count * price;
            }
        });

        return Math.floor(totalAmount * 100) / 100;
    }


    useEffect(() => {
        fetchProductData()
    }, [])
    useEffect(() => {
        fetchFeaturedProductData()
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserData()
        }
        fetchUserData()
    }, [user])

    const value = {
        user, getToken, isLoading,
        currency, router,
        featuredproducts, fetchFeaturedProductData,
        isSeller, setIsSeller,
        CartEntryDelete,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount,
        updateProduct
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}