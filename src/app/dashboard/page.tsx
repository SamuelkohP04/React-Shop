"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { onAuthStateChanged } from "firebase/auth";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dynamic from "next/dynamic";

// @ts-expect-error
const DatePicker = dynamic<any>(() => import("react-datepicker").then(m => m.default), { ssr: false });

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalBooking, setModalBooking] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
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

  // Helper: get bookings for a date
  const getBookingsForDate = (date: Date) => {
    const ymd = date.toISOString().slice(0, 10);
    return bookings.filter(b => b.date && b.date.slice(0, 10) === ymd);
  };

  // Calendar tile content: show a dot for each booking
  const tileContent = ({ date, view }: any) => {
    if (view === "month") {
      const count = getBookingsForDate(date).length;
      if (count > 0) {
        return (
          <div className="flex justify-center items-center mt-1">
            {Array.from({ length: count }).map((_, i) => (
              <span key={i} className="inline-block w-2 h-2 bg-blue-600 rounded-full mx-0.5"></span>
            ))}
          </div>
        );
      }
    }
    return null;
  };

  // On date click, show modal with all bookings for that date
  const handleDateClick = (date: Date) => {
    const bookingsOnDate = getBookingsForDate(date);
    if (bookingsOnDate.length > 0) {
      setSelectedDate(date);
      setModalBooking(bookingsOnDate); // now an array
      setShowModal(true);
    }
  };

  // Cancel booking with confirmation
  const handleCancelBooking = async (booking: any) => {
    if (!window.confirm("Are you sure you want to cancel this booking? No refunds will be issued.")) return;
    setModalLoading(true);
    setModalError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const idToken = await user.getIdToken();
      const res = await fetch("/api/cancelBooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to cancel booking");
      }
      setBookings(bookings.filter(b => b.id !== booking.id));
      setShowModal(false);
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Reschedule booking with confirmation using react-calendar
  const [calendarRescheduleDate, setCalendarRescheduleDate] = useState<Date | null>(null);

  // Reschedule booking with confirmation
  const handleRescheduleBooking = async (booking: any, newDate: Date | null) => {
    if (!newDate) return;
    if (!window.confirm("Are you sure you want to reschedule this booking?")) return;
    setModalLoading(true);
    setModalError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const idToken = await user.getIdToken();
      const res = await fetch("/api/rescheduleBooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ bookingId: booking.id, newDate: newDate.toISOString() }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to reschedule booking");
      }
      setBookings(bookings.map(b => b.id === booking.id ? { ...b, date: newDate.toISOString() } : b));
      setShowModal(false);
      setRescheduleMode(false);
      setRescheduleDate(null);
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
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
      {/* Welcome message */}
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mt-8 mb-4">Welcome Back, {profile?.username || profile?.fullname || "User"}!</h1>
      {/* Book button */}
      <div className="w-full flex justify-center mb-4">
        <Button className="bg-blue-600 text-white font-bold" onClick={() => router.push("/dashboard/book")}>Book through web now</Button>
      </div>
      {/* Profile button */}
      <div className="w-full flex justify-center mb-4">
        <Button variant="outline" onClick={() => router.push("/dashboard/profile")}>View/Edit Personal Information</Button>
      </div>
      {/* Logout button */}
      <div className="fixed top-6 right-8 z-30">
        <Button variant="outline" onClick={handleLogout} className="font-semibold">Logout</Button>
      </div>
      {/* Bookings Calendar Section */}
      <div className="w-full max-w-2xl flex flex-col items-center justify-center mt-8 bg-white/90 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">My Bookings</h2>
        {bookingsLoading ? (
          <div>Loading bookings...</div>
        ) : bookingsError ? (
          <div className="text-red-600">{bookingsError}</div>
        ) : (
          <>
            <div className="flex justify-center">
              <Calendar
                tileContent={tileContent}
                onClickDay={handleDateClick}
                className="mb-4"
              />
            </div>
            {showModal && modalBooking && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                  <button className="absolute top-2 right-2 text-gray-500" onClick={() => { setShowModal(false); setRescheduleMode(false); setModalError(null); }}>&times;</button>
                  <h3 className="text-xl font-bold mb-2">Bookings for {selectedDate ? selectedDate.toLocaleDateString() : ""}</h3>
                  {Array.isArray(modalBooking) && modalBooking.map((booking, idx) => (
                    <div key={booking.id} className="mb-4 border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="mb-2"><span className="font-semibold">Service:</span> {booking.service}</div>
                      <div className="mb-2"><span className="font-semibold">Date:</span> {booking.date ? (new Date(booking.date).toLocaleString()) : '-'}</div>
                      <div className="mb-2"><span className="font-semibold">Remarks:</span> {booking.remarks || '-'}</div>
                      {modalError && <div className="text-red-600 mb-2">{modalError}</div>}
                      {rescheduleMode === booking.id ? (
                        <div className="flex flex-col gap-2 mt-2 items-center">
                          <Calendar
                            onClickDay={(date: Date) => {
                              setCalendarRescheduleDate(date);
                              if (window.confirm("Are you sure you want to reschedule this booking?")) {
                                handleRescheduleBooking(booking, date);
                              }
                            }}
                            minDate={new Date()}
                            value={calendarRescheduleDate || (booking.date ? new Date(booking.date) : new Date())}
                          />
                          <Button variant="outline" onClick={() => { setRescheduleMode(false); setCalendarRescheduleDate(null); }}>Cancel</Button>
                        </div>
                      ) : (
                        <div className="flex gap-2 mt-2">
                          <Button variant="destructive" onClick={() => handleCancelBooking(booking)} disabled={modalLoading}>Cancel Booking</Button>
                          <Button variant="outline" onClick={() => { setRescheduleMode(booking.id); setCalendarRescheduleDate(booking.date ? new Date(booking.date) : new Date()); }}>Reschedule</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 