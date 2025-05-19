"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RequireAdminProps {
  children: React.ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== "admin") {
      router.push("/404");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || user?.publicMetadata?.role !== "admin") {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
