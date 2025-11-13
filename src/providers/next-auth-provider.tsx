'use client'

import { useBrandsStore } from "@/stores/brands";
import { useCarsStore } from "@/stores/cars";
import { Loader2 } from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";
import React from "react";
import { useSnapshot } from "valtio";

function Skeleton() {
  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <Loader2 className="animate-spin"/>
    </main>
  );
}

interface NextAuthProviderProps {
  children: React.ReactNode;
}

export default function NextAuthProvider({ children }: NextAuthProviderProps) {
  return (
    <SessionProvider>
      <AuthWrapper>{children}</AuthWrapper>
    </SessionProvider>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const cars = useSnapshot(useCarsStore)
  const brands = useSnapshot(useBrandsStore)
  const { status } = useSession();

  if (status === "loading") {
    return <Skeleton />;
  }

  return <>{children}</>;
}
