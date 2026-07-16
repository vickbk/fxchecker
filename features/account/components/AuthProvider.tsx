"use client";
import { ReactNode } from "react";
import { AuthContext, useAuthProvider } from "../hooks/useAuth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <AuthContext value={useAuthProvider()}>{children}</AuthContext>;
};
