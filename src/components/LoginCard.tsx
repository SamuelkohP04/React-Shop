// LoginCard.tsx
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { auth } from "@/lib/firebaseClient";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

function LoginCard() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    username: "",
    phone: "",
    dob: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        // LOGIN FLOW
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const idToken = await userCredential.user.getIdToken();
        // Fetch user profile from server
        const res = await fetch("/api/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Unknown error");
        }
        router.push("/dashboard");
      } else {
        // REGISTER FLOW
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const idToken = await userCredential.user.getIdToken();
        // Send profile data to server to create Firestore user
        const res = await fetch("/api/createProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            fullname: formData.fullname,
            username: formData.username,
            dob: formData.dob,
            phone: formData.phone,
            email: formData.email,
          }),
        });
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Unknown error");
        }
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-2/5 flex flex-col bg-slate-100 border-0 rounded p-4 gap-4 max-lg:w-5/6">
      <CardHeader>
        <h1 className="text-4xl font-bold">LOGO</h1>
        <h1 className="text-2xl font-semibold">{isLogin ? "Login" : "Register"}</h1>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {error && <div className="text-red-600">{error}</div>}
        <Input name="email" placeholder="Email" value={formData.email} onChange={handleChange} disabled={loading} />
        <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} disabled={loading} />

        {!isLogin && (
          <>
            <Input name="fullname" placeholder="Full Name" value={formData.fullname} onChange={handleChange} disabled={loading} />
            <Input name="username" placeholder="Username" value={formData.username} onChange={handleChange} disabled={loading} />
            <Input name="dob" placeholder="Date of Birth (YYYY-MM-DD)" value={formData.dob} onChange={handleChange} disabled={loading} />
            <Input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} disabled={loading} />
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button onClick={handleSubmit} disabled={loading}>
          {isLogin ? "Login" : "Register"}
        </Button>
        <Button variant="link" onClick={() => setIsLogin(!isLogin)} disabled={loading}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default LoginCard;
