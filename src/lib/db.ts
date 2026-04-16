import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface UserProfile {
  name: string;
  email: string;
  handicap: number;
  plan: "free" | "pro";
  memberSince: string;
  swingsAnalyzed: number;
  avgConfidence: number;
  topFault: string;
  notifications: boolean;
  weeklyTips: boolean;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function createUserProfile(uid: string, data: Pick<UserProfile, "name" | "email">): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    name: data.name,
    email: data.email,
    handicap: 0,
    plan: "free",
    memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    swingsAnalyzed: 0,
    avgConfidence: 0,
    topFault: "—",
    notifications: true,
    weeklyTips: true,
    createdAt: serverTimestamp(),
  });
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await setDoc(doc(db, "users", uid), { ...data }, { merge: true });
}
