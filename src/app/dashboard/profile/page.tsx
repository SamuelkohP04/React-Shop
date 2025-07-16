"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
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
        setEditData({
          fullname: data.fullname || "",
          username: data.username || "",
          dob: data.dob && data.dob._seconds ? format(new Date(data.dob._seconds * 1000), "yyyy-MM-dd") : "",
          phone: data.phone || "",
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const idToken = await user.getIdToken();
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          fullname: editData.fullname,
          username: editData.username,
          dob: editData.dob ? new Date(editData.dob).toISOString() : null,
          phone: editData.phone,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to update profile");
      }
      setSuccessMsg("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format Firestore timestamp or string
  const formatDate = (ts: any) => {
    if (!ts) return "-";
    if (typeof ts === "string") return new Date(ts).toLocaleString();
    if (ts._seconds) return new Date(ts._seconds * 1000).toLocaleString();
    if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString();
    return "-";
  };

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
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <Card className="w-full max-w-lg shadow-2xl rounded-2xl bg-white/90 border-0 p-8">
        <CardHeader className="mb-4 text-center">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2 tracking-tight">Personal Information</h1>
        </CardHeader>
        <CardContent>
          {successMsg && <div className="text-green-600 text-center mb-2">{successMsg}</div>}
          <div className="grid grid-cols-1 gap-4 text-lg">
            <div>
              <span className="font-semibold">Full Name:</span>
              <Input name="fullname" value={editData.fullname} onChange={handleEditChange} className="ml-2" />
            </div>
            <div>
              <span className="font-semibold">Username:</span>
              <Input name="username" value={editData.username} onChange={handleEditChange} className="ml-2" />
            </div>
            <div>
              <span className="font-semibold">Date of Birth:</span>
              <Input name="dob" type="date" value={editData.dob} onChange={handleEditChange} className="ml-2" />
            </div>
            <div>
              <span className="font-semibold">Phone:</span>
              <Input name="phone" value={editData.phone} onChange={handleEditChange} className="ml-2" />
            </div>
            <div>
              <span className="font-semibold">Email:</span> {profile.email}
            </div>
            <div>
              <span className="font-semibold">Joined:</span> {formatDate(profile.createdAt)}
            </div>
            <div>
              <span className="font-semibold">Payment Plan:</span> {profile.paymentPlan || "none"}
            </div>
            <div className="flex gap-2 mt-2">
              <Button onClick={handleSave} disabled={loading}>Save</Button>
              <Button variant="outline" onClick={() => router.push("/dashboard")}>Cancel</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 