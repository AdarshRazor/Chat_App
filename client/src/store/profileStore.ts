import { create } from "zustand";
import { useAuthStore } from "./authStore";

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
  needsRedirected: boolean;
  resetRedirectFlag: ()=> void;
  isLoading: boolean;
  error: string | null;
}


export const useProfileStore = create<ProfileState>((set, get) => ({
  userDetails: null,
  allUsers: [],
  needsRedirect: false,
  isLoading: false,
  needsRedirected: false,
  error: null,

  fetchUserDetails: async () => {
    set({ isLoading: true, error: null });

    try {
      // First, check if the user is authenticated
      //useAuthStore.getState().checkAuth();
      const isAuthenticated = useAuthStore.getState().isAuthenticated;

      if (!isAuthenticated) {
        set({ userDetails: null, isLoading: false, error: "User not authenticated", needsRedirected: true });
        console.log('profile store auth error , redirect to login')
      }

      const token = localStorage.getItem("token");
      if (!token) {
        set({ userDetails: null, isLoading: false, error: "No token found", needsRedirected: true });
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
        throw new Error(errData.message || 'Failed to fetch user details.');
      }

      const data: User = await res.json();
      console.log('Online user from profilestore', data);

      set({ userDetails: data, isLoading: false, needsRedirected: false });
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

      if (!isAuthenticated) {
        set({ userDetails: null, isLoading: false, error: "User not authenticated", needsRedirected: true });
        console.log('profile store auth error , redirect to login')
        //router.push('/login');
      }

      const token = localStorage.getItem("token");
      if (!token) {
        set({ userDetails: null, isLoading: false, error: "No token found", needsRedirected: true });
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
        throw new Error(errData.message || 'Failed to fetch user details.');
      }

      const data: User[] = await res.json();
      console.log('Online users from profilestore', data);
      set({ allUsers: data, isLoading: false, needsRedirected: false });
    } catch (error: any) {
      console.error("Error fetching user details:", error);
      set({ isLoading: false });
    }
  },

  clearUserDetails: () => {
    set({ userDetails: null });
  },

  resetRedirectFlag: () => {
    set({ needsRedirected: false })
  }
}));