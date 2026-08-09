import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Base API URL
const API_URL = "http://localhost:5000/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  // Load initial user state from sessionStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem("sc_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [startups, setStartups] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = sessionStorage.getItem("sc_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Sync user and bookmarks with sessionStorage
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem("sc_user", JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem("sc_user");
    }
  }, [currentUser]);

  useEffect(() => {
    sessionStorage.setItem("sc_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Fetch Startups from API on Mount
  useEffect(() => {
    fetchStartups();
  }, []);

  // Fetch user requests if a user is logged in
  useEffect(() => {
    if (currentUser?._id || currentUser?.id) {
      fetchUserRequests(currentUser._id || currentUser.id);
    }
  }, [currentUser]);

  // 1. Fetch All Startups
  const fetchStartups = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/startups`);
      setStartups(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching startups:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch User Join Requests
  const fetchUserRequests = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/requests/user/${userId}`);
      setJoinRequests(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  // 3. Auth: Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const user = res.data.user || res.data;
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      return { success: false, message };
    }
  };

  // 4. Auth: Register
  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      const user = res.data.user || res.data;
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      return { success: false, message };
    }
  };

  // 5. Auth: Logout
  const logout = () => {
    setCurrentUser(null);
    setJoinRequests([]);
    sessionStorage.removeItem("sc_user");
    sessionStorage.removeItem("sc_bookmarks");
    sessionStorage.clear();
  };

  // 6. Submit Join Request
  const submitJoinRequest = async (startupId, roleId, roleTitle, note = "") => {
    try {
      const payload = {
        userId: currentUser?._id || currentUser?.id,
        startupId,
        roleRequested: roleTitle,
        message: note,
      };

      const res = await axios.post(`${API_URL}/requests`, payload);
      const newReq = res.data.joinRequest || res.data.data || res.data;

      // Safely ensure prev is an array before spreading
      setJoinRequests((prev) =>
        Array.isArray(prev) ? [newReq, ...prev] : [newReq],
      );
      return { success: true };
    } catch (err) {
      console.error("Error submitting join request:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to submit request",
      };
    }
  };

  // 7. Update User Profile
  const updateProfile = async (updatedProfile) => {
    try {
      const userId = currentUser?._id || currentUser?.id;

      let payload;
      if (updatedProfile instanceof FormData) {
        payload = updatedProfile;
        if (!payload.has("userId")) {
          payload.append("userId", userId);
        }
      } else {
        payload = {
          userId,
          ...updatedProfile,
        };
      }

      const res = await axios.put(`${API_URL}/auth/profile`, payload);

      const user = res.data.user || res.data;
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      console.error("Error updating profile:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Update failed",
      };
    }
  };

  // 8. Toggle Bookmark (Session State)
  const toggleBookmark = (startupId) => {
    setBookmarks((prev) =>
      prev.includes(startupId)
        ? prev.filter((id) => id !== startupId)
        : [...prev, startupId],
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        bookmarks,
        joinRequests,
        startups,
        loading,
        toggleBookmark,
        submitJoinRequest,
        updateProfile,
        login,
        register,
        logout,
        fetchStartups,
        setJoinRequests,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
