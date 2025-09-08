"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
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
      // Simulate API call - replace with actual authentication logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept any email/username and password combination
      if (emailOrUsername && password) {
        // Check if input is email format
        const isEmail = emailOrUsername.includes("@");

        const userData: User = {
          id: "1",
          name: isEmail ? emailOrUsername.split("@")[0] : emailOrUsername, // Use email prefix or username as name
          email: isEmail ? emailOrUsername : `${emailOrUsername}@example.com`, // If username, create a demo email
          balance: 1000, // Default balance for demo
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
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      // Simulate API call - replace with actual registration logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept any valid registration
      if (name && email && password) {
        const userData: User = {
          id: "1",
          name: name,
          email: email,
          balance: 1000, // Default balance for demo
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

  const value = {
    user,
    login,
    register,
    logout,
    loading,
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
