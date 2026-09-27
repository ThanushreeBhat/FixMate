'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

import { auth, db } from "../../lib/firebase/firebase";

import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

export default function NotificationBell() {

  const [count, setCount] = useState<number>(0);

  useEffect(() => {

    const user = auth.currentUser;

    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      where("isRead", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCount(snapshot.size);
    });

    return () => unsubscribe();

  }, []);

  return (

    <Link
      href="/customer/notifications"
      className="relative"
    >

      <Bell size={24} className="text-[#0A2540]" />

      {count > 0 && (

        <span
          className="absolute -top-2 -right-2
          bg-red-600 text-white rounded-full
          text-xs w-5 h-5 flex items-center
          justify-center"
        >
          {count}
        </span>

      )}

    </Link>

  );

}