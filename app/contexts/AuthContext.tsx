"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { userApi } from "../../lib/api-client";

interface User {
  id: number;
  username: string;
  email: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  refreshBalance: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (
    emailOrUsername: string,
    password: string
  ): Promise<boolean> => {
    try {
      // เรียก API เพื่อ login
      const response = await userApi.login({
        username: emailOrUsername,
        password: password,
      });

      if (response && response.user) {
        const userData: User = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          balance: parseFloat(response.user.balance) || 0,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      // เรียก API เพื่อสมัครสมาชิก
      const response = await userApi.register({
        username: username,
        email: email,
        password: password,
      });

      if (response && response.user) {
        const userData: User = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          balance: parseFloat(response.user.balance) || 0,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const refreshBalance = async () => {
    if (!user) return;

    try {
      const response = await userApi.getUserById(user.id);
      if (response) {
        const updatedUser = {
          ...user,
          balance: parseFloat(response.balance) || user.balance,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error refreshing balance:", error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    refreshBalance,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
