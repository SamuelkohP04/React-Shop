import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) return NextResponse.json({ error: "No token provided" }, { status: 401 });
    const idToken = match[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const db = getFirestore();
    const doc = await db.collection("users").doc(uid).get();
    if (!doc.exists) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    return NextResponse.json(doc.data(), { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
} 