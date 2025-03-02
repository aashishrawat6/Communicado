import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

// in the object passed to create, we can define the initial state of the store
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  isCheckingAuth: true, // as soon as page refresh we will check user's authentication
  onlineUsers:[],
  socket: null,

  
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res= await axiosInstance.post("/auth/signup", data); // send a POST request to /auth/signup with the form data that we get from in signup function
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in signup: ", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async(data)=>{
    set({isLoggingIng: true});
    try{
      const res = await axiosInstance.post("/auth/login", data);
      set({authUser: res.data});
      toast.success("Logged in successfully");
      get().connectSocket();
    }catch(error){
      toast.error(error.response.data.message);
      console.log("Error in login: ", error);
    }finally{
      set({isLoggingIng: false});
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in logout: ", error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({authUser: res.data});
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in updateProfile: ", error);
      toast.error(error.response.data.message);
    }finally{
      set({isUpdatingProfile: false});
    }
  },

  connectSocket: () => {
    const { authUser } = get(); // WE ARE USING get() TO GET THE CURRENT STATE OF THE STORE
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id, // we are sending the userId to the backend for the socket connection in order to map the online users
      },
    });
    socket.connect();

    set({ socket: socket });    // we will use set() to update the state of the socket with the value socket that we are getting from the io() function

    socket.on("getOnlineUsers", (userIds) => {  // whenever we want to listen anything from the server we use socket.on() function
      set({ onlineUsers: userIds });  // we are getting userIds from the server and updating the state of onlineUsers with the userIds
    });
  },

  disconnectSocket: () => {   // when the broswer is closed or user logs out, we will disconnect the socket, btw browser do it automatically on closing of tab
    if (get().socket?.connected) get().socket.disconnect();
  },
  
}));
