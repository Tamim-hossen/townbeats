"use client"
import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton, UserProfile, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
const Navbar = () => {

  const pathname= usePathname();
  const { isSeller, router} = useAppContext();
  const {user} = useUser();

  const { openSignIn } = useClerk()
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-16 md:w-24"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden transition ease-in-out">
        <Link href="/" className={`hover:text-gray-900 transition duration-[.5ms] delay-0 ease-in-out p-3 ${pathname === '/' ? "border-b-2 border-gray-500" : ""} hover:scale-105 active:scale-100`}>
          Home
        </Link>
        <Link href="/all-products" className={`hover:text-gray-900 transition duration-[.5ms] delay-0 ease-in-out hover:scale-105 active:scale-100 p-3 ${pathname === '/all-products' ? "border-b-2 border-gray-500" : ""}`}>
          Shop
        </Link>
        <Link href="/" className={`hover:text-gray-900 transition duration-[.5ms] delay-0 ease-in-out hover:scale-105 active:scale-100 p-3 ${pathname === '/about-us' ? "border-b-2 border-gray-500" : ""}`} >
          About Us
        </Link>
        <Link href="/" className={`hover:text-gray-900 transition duration-[.5ms] delay-0 ease-in-out hover:scale-105 active:scale-100 p-3 ${pathname === '/contact' ? "border-b-2 border-gray-500" : ""}`}>
          Contact
        </Link>

        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Dashboard</button>}

      </div>
      <ul className="hidden md:flex items-center gap-4 ">
        {user ?
          <>
          <button onClick={()=>router.push('/cart')}><Image src = {assets.cart_icon} alt="Cart"/></button>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={ () => router.push('/cart')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={ () => router.push('/my-orders')} />
            </UserButton.MenuItems>
          </UserButton>
          </> : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Log In
          </button>}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Dashboard</button>}
        {user ?
          <>
          <button onClick={()=>router.push('/cart')}><Image src = {assets.cart_icon} alt="Cart"/></button>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={ () => router.push('/')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="Shop" labelIcon={<BoxIcon />} onClick={ () => router.push('/all-products')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={ () => router.push('/cart')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={ () => router.push('/my-orders')} />
            </UserButton.MenuItems>
          </UserButton>
          </> : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Log In
          </button>}
      </div>
    </nav>
  );
};

export default Navbar;