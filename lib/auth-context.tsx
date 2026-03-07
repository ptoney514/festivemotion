"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "festivemotion-user";

export type MockUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

type AuthContextValue = {
  user: MockUser | null;
  isLoading: boolean;
  createAccount: (email: string, name: string, password: string) => void;
  login: (email: string, password: string) => MockUser | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function loadUser(): MockUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MockUser;
  } catch {
    return null;
  }
}

function saveUser(user: MockUser) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // localStorage unavailable
  }
}

function clearUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(loadUser());
    setIsLoading(false);
  }, []);

  const createAccount = useCallback(
    (email: string, name: string, _password: string) => {
      const newUser: MockUser = {
        id: generateId(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };
      saveUser(newUser);
      setUser(newUser);
    },
    [],
  );

  const login = useCallback((email: string, _password: string): MockUser | null => {
    const existing = loadUser();
    if (existing && existing.email === email) {
      setUser(existing);
      return existing;
    }
    // Mock: create a new user on login if none exists
    const newUser: MockUser = {
      id: generateId(),
      email,
      name: email.split("@")[0],
      createdAt: new Date().toISOString(),
    };
    saveUser(newUser);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    createAccount,
    login,
    logout,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
