"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Loader from "./Loader";

const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password"];
const PRIVATE_ROUTE_PREFIXES = ["/dashboard", "/map", "/project", "/analytics"];

const matchesPrefix = (pathname: string, prefixes: string[]) => {
  return prefixes.some(prefix => pathname.startsWith(prefix));
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const isPublic = matchesPrefix(pathname, PUBLIC_ROUTES);
      const isPrivate = matchesPrefix(pathname, PRIVATE_ROUTE_PREFIXES);
      setUser(firebaseUser);
      setLoading(false);

      if (pathname === "/") {
        router.replace(firebaseUser ? "/dashboard" : "/login");
        return;
      }

      if (!firebaseUser && isPrivate) {
        router.replace("/login");
        return;
      }

      if (firebaseUser && isPublic) {
        router.replace("/dashboard");
        return;
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) return <Loader />;

  const isPublic = matchesPrefix(pathname, PUBLIC_ROUTES);
  const isPrivate = matchesPrefix(pathname, PRIVATE_ROUTE_PREFIXES);

  if (!user && isPublic) return <>{children}</>;
  if (user && isPrivate) return <>{children}</>;

  return null;
}
