import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";
import Cookies from "js-cookie";
//import { useRouter } from "next/router";

interface User {
  _id: number;
  firstname: string;
  lastname: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProfileState {
  userDetails: User | null;
  allUsers: User[];
  fetchUserDetails: () => Promise<void>;
  fetchAllUsersDetail: ()=> Promise<void>;
  clearUserDetails: () => void;
  isLoading: boolean;
  error: string | null;
}

//const router = useRouter()

export const useProfileStore = create<ProfileState>((set, get) => ({
  userDetails: null,
  allUsers: [],
  isLoading: false,
  error: null,

  fetchUserDetails: async () => {
    set({ isLoading: true, error: null });

    try {
      // First, check if the user is authenticated
      //useAuthStore.getState().checkAuth();
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      console.log('auth done here')

      if (!isAuthenticated) {
        set({ userDetails: null, isLoading: false, error: "User not authenticated" });
        console.log('profile store auth error , redirect to login')
        //router.push('/login');
      }

      const token = localStorage.getItem("token");
      if (!token) {
        set({ userDetails: null, isLoading: false, error: "No token found" });
        return;
      }

      // Fetch user details
      const res = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        //router.push('/login');
        throw new Error(errData.message || 'Failed to fetch user details.');
      }

      const data: User = await res.json();
      console.log('Online user from profilestore', data);

      set({ userDetails: data, isLoading: false });
    } catch (error: any) {
      console.error("Error fetching user details:", error);
      set({ isLoading: false });
    }
  },

  fetchAllUsersDetail: async () => {
    set({ isLoading: true, error: null });

    try {
      // First, check if the user is authenticated
      //useAuthStore.getState().checkAuth();
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      console.log('auth done here')

      if (!isAuthenticated) {
        set({ userDetails: null, isLoading: false, error: "User not authenticated" });
        console.log('profile store auth error , redirect to login')
        //router.push('/login');
      }

      const token = localStorage.getItem("token");
      if (!token) {
        set({ userDetails: null, isLoading: false, error: "No token found" });
        return;
      }

      // Fetch user details
      const res = await fetch('http://localhost:3000/api/auth/people', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        //router.push('/login');
        throw new Error(errData.message || 'Failed to fetch user details.');
      }

      const data: User[] = await res.json();
      console.log('Online users from profilestore', data);
      set({ allUsers: data, isLoading: false });
    } catch (error: any) {
      console.error("Error fetching user details:", error);
      set({ isLoading: false });
    }
  },

  clearUserDetails: () => {
    set({ userDetails: null });
  },
}));