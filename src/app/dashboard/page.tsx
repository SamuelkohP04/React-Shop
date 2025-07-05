"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("Not authenticated");
        const idToken = await user.getIdToken();
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Failed to fetch profile");
        }
        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg mb-4">{error}</div>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <Card className="w-full max-w-lg shadow-2xl rounded-2xl bg-white/90 border-0 p-8">
        <CardHeader className="mb-4 text-center">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2 tracking-tight">Welcome, {profile.fullname || profile.username}!</h1>
          <h2 className="text-lg text-gray-600">Your Profile</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-lg">
            <div><span className="font-semibold">Full Name:</span> {profile.fullname}</div>
            <div><span className="font-semibold">Username:</span> {profile.username}</div>
            <div><span className="font-semibold">Email:</span> {profile.email}</div>
            <div><span className="font-semibold">Date of Birth:</span> {profile.dob}</div>
            <div><span className="font-semibold">Phone:</span> {profile.phone}</div>
            <div><span className="font-semibold">Joined:</span> {profile.createdAt ? new Date(profile.createdAt.seconds ? profile.createdAt.seconds * 1000 : profile.createdAt).toLocaleString() : "-"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 