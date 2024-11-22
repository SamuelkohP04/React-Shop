"use client"

import { useState, useEffect } from "react";

import ProductCard from "@/components/ProductCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";

function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Product[]>([]);

    useEffect(() => {
        setProducts([{ id: "1", name: "crystal1", desc: "this is a crystal", price: 10.2, amount: 1 }, { id: "2", name: "crystal2", desc: "this is a crystal", price: 10.2, amount: 1 }, { id: "3", name: "crystal3", desc: "this is a crystal", price: 10.2, amount: 1 }, { id: "4", name: "crystal4", desc: "this is a crystal", price: 10.2, amount: 1 }]);
    }, []);

    return (
        <>
            <Navbar cart={cart} setCart={setCart} />
            <div className="w-full h-screen flex flex-col justify-center items-center bg-neutral-200">
                <div className="w-5/6 h-5/6 flex flex-col gap-8">
                    <h1 className="text-7xl font-semibold">Crystals</h1>
                    <p className="text-xl">Explore our collection of crystals, perfect for bringing balance, harmony, and positive energy into your life. Whether for healing, décor, or a thoughtful gift, find the perfect piece to inspire and uplift.</p>
                    <Select>
                        <SelectTrigger className="w-[180px] rounded-full p-4">
                            <SelectValue placeholder="Price" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Least Expensive</SelectItem>
                            <SelectItem value="dark">Most Expensive</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex gap-8 max-lg:flex-col max-lg:pb-8">
                        {products.map((product: any) => {
                            return (
                                <ProductCard key={product.id} product={product} cart={cart} setCart={setCart} />
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home