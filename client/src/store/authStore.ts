import Cookies from "js-cookie";
import {create} from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  checkAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  checkAuth: () => {
    const token = Cookies.get("token");
    console.log("Checking authentication...");
    if (token) {
      console.log("Token exists. Setting authenticated to true.");
      set({ isAuthenticated: true });
    } else {
      console.log("Token does not exist. Setting authenticated to false.");
      set({ isAuthenticated: false });
    }
  },
  logout: () => {
    Cookies.remove("token");
    set({ isAuthenticated: false });
  },
}));