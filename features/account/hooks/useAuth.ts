import { createContext, useContext, useState } from "react";
import { AuthDescription } from "../types";

export const AuthContext = createContext(
  {} as AuthDescription & {
    setDescriptions: (params: AuthDescription) => void;
  },
);

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthProvider() {
  const [descriptions, setDescriptions] = useState<AuthDescription>({});
  return { ...descriptions, setDescriptions };
}
