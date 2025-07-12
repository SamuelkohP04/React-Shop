"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProfileForUser(user);
      } else {
        setLoading(false);
        setError("Not authenticated");
      }
    });

    async function fetchProfileForUser(user: any) {
      setLoading(true);
      setError(null);
      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Failed to fetch profile");
        }
        const data = await res.json();
        const convertTimestamp = (ts: any) => {
          if (!ts) return "-";
          if (typeof ts === "string") return ts;
          if (ts._seconds) return new Date(ts._seconds * 1000).toLocaleString();
          if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString();
          return "-";
        };
        setProfile({
          ...data,
          dob: convertTimestamp(data.dob),
          createdAt: convertTimestamp(data.createdAt),
        });
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

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchBookings() {
      if (!profile || !auth.currentUser) return;
      setBookingsLoading(true);
      setBookingsError(null);
      try {
        const idToken = await auth.currentUser.getIdToken();
        const res = await fetch("/api/myBookings", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Failed to fetch bookings");
        }
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err: any) {
        setBookingsError(err.message);
      } finally {
        setBookingsLoading(false);
      }
    }
    if (profile) fetchBookings();
  }, [profile]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

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
      setEditMode(false);
      // Refetch profile
      const updated = await res.json();
      setProfile({
        ...profile,
        ...updated,
        dob: updated.dob ? new Date(updated.dob).toLocaleString() : profile.dob,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const idToken = await user.getIdToken();

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to start checkout");
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      {/* Book button */}
      <div className="w-full flex justify-center mb-4">
        <Button className="bg-blue-600 text-white font-bold" onClick={() => router.push("/dashboard/book")}>Book through web now</Button>
      </div>
      {/* Logout button */}
      <div className="fixed top-6 right-8 z-30">
        <Button variant="outline" onClick={handleLogout} className="font-semibold">Logout</Button>
      </div>
      <Card className="w-full max-w-lg shadow-2xl rounded-2xl bg-white/90 border-0 p-8">
        <CardHeader className="mb-4 text-center">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2 tracking-tight">Welcome, {profile.fullname || profile.username}!</h1>
          <h2 className="text-lg text-gray-600">Your Profile</h2>
        </CardHeader>
        <CardContent>
          {successMsg && <div className="text-green-600 text-center mb-2">{successMsg}</div>}
          {editMode ? (
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
                <span className="font-semibold">Joined:</span> {profile.createdAt}
              </div>
              <div>
                <span className="font-semibold">Payment Plan:</span> {profile.paymentPlan || "none"}
              </div>
              {profile.paymentPlan === "Basic" && (
                <div className="flex gap-2 mt-2">
                  <Button onClick={handleUpgrade} disabled={loading} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold">Upgrade to Enlightenment ($10)</Button>
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <Button onClick={handleSave} disabled={loading}>Save</Button>
                <Button variant="outline" onClick={() => { setEditMode(false); setEditData({ fullname: profile.fullname, username: profile.username, dob: profile.dob ? format(new Date(profile.dob), "yyyy-MM-dd") : "", phone: profile.phone }); setSuccessMsg(null); }}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 text-lg">
              <div><span className="font-semibold">Full Name:</span> {profile.fullname}</div>
              <div><span className="font-semibold">Username:</span> {profile.username}</div>
              <div><span className="font-semibold">Date of Birth:</span> {profile.dob}</div>
              <div><span className="font-semibold">Phone:</span> {profile.phone}</div>
              <div><span className="font-semibold">Email:</span> {profile.email}</div>
              <div><span className="font-semibold">Joined:</span> {profile.createdAt}</div>
              <div><span className="font-semibold">Payment Plan:</span> {profile.paymentPlan || "none"}</div>
              {profile.paymentPlan === "Basic" && (
                <div className="flex gap-2 mt-2">
                  <Button onClick={handleUpgrade} disabled={loading} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold">Upgrade to Enlightenment ($10)</Button>
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <Button onClick={() => setEditMode(true)}>Edit</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Bookings Section */}
      <div className="w-full max-w-2xl mt-8 bg-white/90 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">My Bookings</h2>
        {bookingsLoading ? (
          <div>Loading bookings...</div>
        ) : bookingsError ? (
          <div className="text-red-600">{bookingsError}</div>
        ) : bookings.length === 0 ? (
          <div>No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-left">
              <thead>
                <tr className="bg-blue-100">
                  <th className="py-2 px-4 border">Service</th>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b">
                    <td className="py-2 px-4 border">{b.service}</td>
                    <td className="py-2 px-4 border">{b.date ? (new Date(b.date).toLocaleString()) : '-'}</td>
                    <td className="py-2 px-4 border">{b.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 