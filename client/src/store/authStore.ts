import Cookies from "js-cookie";
import {create} from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  login: (email:string, password: string) => Promise<void>
  setAuthenticated: (value: boolean) => void;
  checkAuth: () => string | undefined;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: async (email,password) => {
    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          console.log('data from authstore:',data)
    
          // Extract the access token from the response header
          const authHeader = res.headers.get("authorization");
          console.log('authheader',authHeader)
          const accessToken = authHeader?.split(" ")[1];
          console.log('authstore accesstoken', accessToken)
          if (!accessToken) {
            //setError("Login failed: No access token received.");
            console.log("Login Failed");
            set({ isAuthenticated: false });
            return;
          }
          console.log('isauth true')
          set({ isAuthenticated: true });

          // Store the token in localStorage for later use (if needed)
          localStorage.setItem("token", accessToken);
          return;
    } catch (error){
        console.log('Error', error)
    }
  },
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  checkAuth: () => {
    const token = localStorage.getItem("token");
    console.log("Checking authentication...");
    if (token) {
      console.log("Token exists. Setting authenticated to true.");
      set({ isAuthenticated: true });
      return(token);
    } else {
      console.log("Token does not exist. Setting authenticated to false.");
      set({ isAuthenticated: false });
    }
  },
  logout: () => {
    localStorage.removeItem("token"); // Clear the token
    set({ isAuthenticated: false });
  },
}));