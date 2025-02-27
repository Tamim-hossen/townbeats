'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const AddProduct = () => {


  const {getToken} = useAppContext();
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('T-shirt');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [colors,setColors] =useState([])
  const [color,setColor] =useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData()

    formData.append('name',name)
    formData.append('description',description)
    formData.append('category',category)
    formData.append('price',price)
    formData.append('offerPrice',offerPrice)

    for(let i=0;i<files.length;i++){
      formData.append('images',files[i])
    }

    for(let i=0;i<colors.length;i++){
      formData.append('colors',colors[i])
    }
    try {
      const token = await getToken()

      const {data} = await axios.post('/api/product/add',formData,{headers: {Authorization:`Bearer ${token}`}})

      if(data.success){
        toast.success(data.message)
        setFiles([])
        setName("")
        setDescription("")
        setCategory("")
        setPrice("")
        setOfferPrice("")
        setColors([])
      }
      else{
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }

    
    
  };
  const addColor = (e) => {
    (e).preventDefault();
    if (color.trim() !== "") {
      setColors([...colors, color]);
      setColor("");
    }
  };
  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">

            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input onChange={(e) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = e.target.files[0];
                  setFiles(updatedFiles);
                }} type="file" id={`image${index}`} hidden />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}

          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={category}
            >
              <option value="T-shirt">T-shirt</option>
              <option value="Panjabi">Panjabi</option>
              <option value="Shirt">Shirt</option>
              <option value="Pant">Pant</option>
              <option value="Combo">Combo</option>
              <option value="Polo-Shrit">Polo-Shrit</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              
            />
          </div>
        </div>
        <div>
        <p>Add Color</p>
        <div className="p-4 max-w-md mx-auto flex flex-col">
         <div>
         <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        placeholder="Enter a color"
        className="border p-1 rounded mr-3 h-10"
        />
         <button onClick={addColor} className="bg-white text-black border-2 border-black hover:bg-black hover:text-white transition p-2 rounded">
        Add
       </button>
         </div>
      <ul className="mt-4 flex flex-row gap-2">
        {colors.map((col, index) => (
          <li key={index} className="w-5 h-5 p-2 border-2 border-black" style={{ backgroundColor: col }}
          />
        ))}
      </ul>
    </div>
        </div>
        <button type="submit" className="px-8 py-2.5 bg-gray-800 text-white hover:bg-gray-300 hover:text-black transition ease-in-out font-medium rounded">
          ADD - PRODUCT
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;