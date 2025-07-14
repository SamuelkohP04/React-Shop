"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { auth } from "@/lib/firebaseClient";

const SERVICES = [
  "Tarot Card Session",
  "Numerology",
  "Tarot card + Numerology",
  "Marriage Auspicious Date"
];

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);

  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleProceed = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const idToken = await user.getIdToken();
      const res = await fetch("/api/stripe/bookingCheckout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          service,
          date: date ? date.toISOString() : null,
          remarks,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to start booking checkout");
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="w-full max-w-md bg-white/90 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Book a Session</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="text-lg font-semibold mb-2">Select your service:</div>
            {SERVICES.map((svc) => (
              <Button key={svc} className={`w-full ${service === svc ? "bg-blue-600 text-white" : ""}`} onClick={() => setService(svc)}>{svc}</Button>
            ))}
            <Button className="mt-4" disabled={!service} onClick={() => setStep(2)}>Next</Button>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="text-lg font-semibold mb-2">Which date would you like to book a session?</div>  

          {/* centred calendar */}
          <div className="self-center">
            <DatePicker
              selected={date}
              onChange={(d: Date | null) => setDate(d)}
              minDate={new Date()}
              inline
              calendarClassName="border rounded-xl shadow-md"   // optional polish
            />
          </div>

          <Button
            className="mt-4"
            disabled={!date}
            onClick={() => setStep(3)}
          >
            Next
          </Button>

          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="text-lg font-semibold mb-2">Any remarks?</div>
            <Input
              placeholder="Add remarks here..."
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
            />
            <Button className="mt-4" onClick={handleProceed} disabled={loading}>{loading ? "Processing..." : "Proceed to Payment ($40)"}</Button>
          </div>
        )}
        <div className="flex gap-2 mt-6">
          {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
          <Button variant="outline" onClick={() => router.push("/dashboard")}>Cancel</Button>
        </div>
      </div>
    </div>
  );
} 