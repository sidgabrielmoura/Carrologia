'use client'

import { Loader2 } from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";
import React from "react";

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
  const { status } = useSession();

  if (status === "loading") {
    return <Skeleton />;
  }

  return <>{children}</>;
}
