"use client"

import { useState } from "react";

import { useRouter } from "next/navigation";

import { auth } from "@/app/firebase/config"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";

function LoginCard() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const router = useRouter();

    function handleLogin(): void {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                router.push("/")
            });
    }

    function handleRegister(): void {
        if (email !== "" && password !== "") {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                });
        }
    }

    function handleClick(): void {
        if (isLogin) {
            handleLogin();
        } else {
            handleRegister();
        }
    }

    return (
        <Card className="w-2/5 flex flex-col bg-slate-100 border-0 rounded p-4 gap-4">
            <CardHeader>
                <h1 className="text-4xl font-bold">LOGO</h1>
                <h1 className="text-2xl font-semibold">{isLogin ? "Login" : "Register"}</h1>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h1>Email</h1>
                    <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                    <h1>Password</h1>
                    <Input placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full bg-white text-black hover:bg-neutral-200" onClick={handleClick}>{isLogin ? "Login" : "Register"}</Button>
                <Button variant="link" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Don't have an account?" : "Already have an account?"}</Button>
            </CardFooter>
        </Card>
    );
}

export default LoginCard