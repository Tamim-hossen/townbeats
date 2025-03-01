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
  const [color,setColor] =useState({
    currentColor:"",
    XXL:0,
    XL: 0 ,
    L: 0,
    M:0,
  })

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

    for (let i = 0; i < colors.length; i++) {
    formData.append("colors", JSON.stringify(colors[i])); 
  }

    console.log(formData)
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
  const removeColor = (index) => {
    setColors(prevColors => prevColors.filter((_, i) => i !== index));
  };
  const addColor = (e) => {
    (e).preventDefault();
    if (color.currentColor.trim() !== "") {
      setColors([...colors, color]);
      setColor(prevColor => ({ ...prevColor, currentColor:"",XXL:0,XL:0,L:0,M:0 }))
    }
  };
  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
        <p className="font-bold text-sm mb-2 text-red-600">Note: All Image Aspect Ratio must be (5:6). The Cover Image(5th image) Aspect Ratio must be (2:3).</p>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
          
            {[...Array(5)].map((_, index) => (
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
              <option value="Jersey">Jersey</option>
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
        <p>Add Color and Sizes:</p>
        <div className="p-4 max-w-md mx-auto flex flex-col">
        <ul className="mb-4 flex flex-col gap-2">
        {colors.map((col, index) => (
          <li key={index} className="flex flex-row gap-3 justify-between">
            <div className="flex flex-row gap-3 items-center">
            <p className="w-5 h-5 p-2 border-2 border-black" style={{ backgroundColor: col.currentColor }}></p>
            <p className="text-center">XXL: {col.XXL}</p>
            <p className="text-center">XL: {col.XL}</p>
            <p className="text-center">L: {col.L}</p>
            <p className="text-center">M: {col.M}</p></div>
            <p onClick={() => removeColor(index)} className="cursor-pointer">x</p>
          </li>
        ))}
        
      </ul>
         <div>
         <input
        type="color"
        value={color.currentColor}
        onChange={(e) => setColor(prevColor => ({ ...prevColor, currentColor: e.target.value }))}
        placeholder="Enter a color"
        className="border p-1 rounded mr-3 h-10 mb-3"
        />
         
         </div>
         {color.currentColor ? <div className="mb-3">
          <ul className="mt-4 flex flex-col gap-2">
            <p>Selected:</p>
          <span className="w-5 h-5 p-2 border-2 border-black" style={{ backgroundColor: color.currentColor }}
          />
          <div className="flex flex-col">
           <span>Enter Sizes:</span>
            <div className="flex gap-2 justify-start items-center mt-2">
            <label>XXL:</label>
            <input type='number' value={color.XXL} placeholder={color.XXL} onChange={(e) => setColor(prevColor => ({ ...prevColor, XXL: e.target.value }))} className="w-12 border-2 border-gray-400 rounded-md px-2"/>
            </div>
            <div className="flex gap-2 justify-start items-center mt-2">
            <label>XL:</label>
            <input type='number' value={color.XL} placeholder={color.XL} onChange={(e) => setColor(prevColor => ({ ...prevColor, XL: e.target.value }))} className="w-12 border-2 border-gray-400 rounded-md ml-[0.6rem] px-2"/>
            </div>
            <div className="flex gap-2 justify-start items-center mt-2">
            <label>L:</label>
            <input type='number' value={color.L} placeholder={color.L} onChange={(e) => setColor(prevColor => ({ ...prevColor, L: e.target.value }))} className="w-12 border-2 border-gray-400 rounded-md ml-[1.2rem] px-2"/>
            </div>
            <div className="flex gap-2 justify-start items-center mt-2">
            <label>M:</label>
            <input type='number' value={color.M} placeholder={color.M} onChange={(e) => setColor(prevColor => ({ ...prevColor, M: e.target.value }))} className="w-12 border-2 border-gray-400 rounded-md ml-[0.9rem] px-2"/>
            </div>
          </div>
          </ul>
          </div>:""}
      
      <button onClick={addColor} className="bg-white text-black border-2 border-black hover:bg-black hover:text-white transition p-2 rounded">
        Add
       </button>
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
