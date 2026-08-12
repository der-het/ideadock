import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// =====================================================
// BASE API URL
// =====================================================

const API_URL = "http://localhost:5000/api";

const AppContext = createContext();

// =====================================================
// APP PROVIDER
// =====================================================

export function AppProvider({ children }) {
  // =====================================================
  // CURRENT USER
  // =====================================================

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem("sc_user");

    return saved ? JSON.parse(saved) : null;
  });

  // =====================================================
  // STARTUPS
  // =====================================================

  const [startups, setStartups] = useState([]);

  // =====================================================
  // JOIN REQUESTS
  // =====================================================

  const [joinRequests, setJoinRequests] = useState([]);

  // =====================================================
  // BOOKMARKS
  // =====================================================

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = sessionStorage.getItem("sc_bookmarks");

    return saved ? JSON.parse(saved) : [];
  });

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // SYNC USER WITH SESSION STORAGE
  // =====================================================

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem("sc_user", JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem("sc_user");
    }
  }, [currentUser]);

  // =====================================================
  // SYNC BOOKMARKS WITH SESSION STORAGE
  // =====================================================

  useEffect(() => {
    sessionStorage.setItem("sc_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // =====================================================
  // 1. FETCH ALL STARTUPS
  // =====================================================

  const fetchStartups = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/startups`);

      const data = res.data.data || res.data.startups || res.data || [];

      setStartups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching startups:", err.response?.data || err);

      setStartups([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // 2. FETCH USER JOIN REQUESTS
  // =====================================================

  const fetchUserRequests = async (userId) => {
    try {
      if (!userId) {
        setJoinRequests([]);
        return;
      }

      console.log("Fetching requests from backend for user:", userId);

      const res = await axios.get(`${API_URL}/requests/user/${userId}`);

      console.log("Backend requests response:", res.data);

      const requests = res.data.data || res.data.joinRequests || res.data || [];

      setJoinRequests(Array.isArray(requests) ? requests : []);
    } catch (err) {
      console.error("Error fetching requests:", err.response?.data || err);

      setJoinRequests([]);
    }
  };

  // =====================================================
  // 3. AUTOMATIC DATA SYNCHRONIZATION
  // =====================================================
  //
  // This keeps frontend data synchronized with MongoDB.
  //
  // It refreshes:
  // 1. When the app/user loads
  // 2. When user returns to the browser tab
  // 3. When browser window gets focus
  // 4. Every 10 seconds
  //
  // This fixes situations like:
  //
  // Admin approves request
  //        ↓
  // MongoDB updated
  //        ↓
  // User Dashboard refreshes data
  //        ↓
  // Pending → Approved
  //
  // =====================================================

  useEffect(() => {
    let isSyncing = false;

    const syncData = async () => {
      // Prevent multiple simultaneous requests
      if (isSyncing) {
        return;
      }

      isSyncing = true;

      try {
        // -------------------------------------------------
        // REFRESH STARTUPS
        // -------------------------------------------------

        await fetchStartups();

        // -------------------------------------------------
        // REFRESH CURRENT USER'S JOIN REQUESTS
        // -------------------------------------------------

        const userId = currentUser?._id || currentUser?.id;

        if (userId) {
          await fetchUserRequests(userId);
        } else {
          setJoinRequests([]);
        }
      } catch (err) {
        console.error("Error synchronizing app data:", err);
      } finally {
        isSyncing = false;
      }
    };

    // -----------------------------------------------------
    // INITIAL SYNC
    // -----------------------------------------------------

    syncData();

    // -----------------------------------------------------
    // REFRESH WHEN TAB BECOMES VISIBLE
    // -----------------------------------------------------

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Tab became visible - refreshing data...");

        syncData();
      }
    };

    // -----------------------------------------------------
    // REFRESH WHEN WINDOW GETS FOCUS
    // -----------------------------------------------------

    const handleFocus = () => {
      console.log("Window focused - refreshing data...");

      syncData();
    };

    // -----------------------------------------------------
    // ADD EVENT LISTENERS
    // -----------------------------------------------------

    document.addEventListener("visibilitychange", handleVisibilityChange);

    window.addEventListener("focus", handleFocus);

    // -----------------------------------------------------
    // AUTOMATIC REFRESH EVERY 10 SECONDS
    // -----------------------------------------------------

    const interval = setInterval(() => {
      console.log("Automatic data refresh...");

      syncData();
    }, 10000);

    // -----------------------------------------------------
    // CLEANUP
    // -----------------------------------------------------

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      window.removeEventListener("focus", handleFocus);

      clearInterval(interval);
    };
  }, [currentUser]);

  // =====================================================
  // 4. AUTH - LOGIN
  // =====================================================

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const user = res.data.user || res.data;

      setCurrentUser(user);

      return {
        success: true,
        user,
      };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";

      return {
        success: false,
        message,
      };
    }
  };

  // =====================================================
  // 5. AUTH - REGISTER
  // =====================================================

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);

      const user = res.data.user || res.data;

      setCurrentUser(user);

      return {
        success: true,
        user,
      };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";

      return {
        success: false,
        message,
      };
    }
  };

  // =====================================================
  // 6. AUTH - LOGOUT
  // =====================================================

  const logout = () => {
    setCurrentUser(null);

    setJoinRequests([]);

    setBookmarks([]);

    sessionStorage.removeItem("sc_user");

    sessionStorage.removeItem("sc_bookmarks");

    sessionStorage.clear();
  };

  // =====================================================
  // 7. SUBMIT JOIN REQUEST
  // =====================================================

  const submitJoinRequest = async (startupId, roleId, roleTitle, note = "") => {
    try {
      // -------------------------------------------------
      // GET CURRENT USER ID
      // -------------------------------------------------

      const userId = currentUser?._id || currentUser?.id;

      // -------------------------------------------------
      // CHECK LOGIN
      // -------------------------------------------------

      if (!userId) {
        return {
          success: false,
          message: "Please login first.",
        };
      }

      // -------------------------------------------------
      // REQUEST PAYLOAD
      // -------------------------------------------------

      const payload = {
        userId,
        startupId,
        roleRequested: roleTitle,
        message: note,
      };

      console.log("Submitting join request:", payload);

      // -------------------------------------------------
      // SEND REQUEST TO BACKEND
      // -------------------------------------------------

      const res = await axios.post(`${API_URL}/requests`, payload);

      console.log("Join request created by backend:", res.data);

      // -------------------------------------------------
      // REFRESH ACTUAL DATA FROM BACKEND
      // -------------------------------------------------

      await fetchUserRequests(userId);

      // -------------------------------------------------
      // RETURN SUCCESS
      // -------------------------------------------------

      return {
        success: true,
        data: res.data.joinRequest || res.data.data || res.data,
      };
    } catch (err) {
      console.error(
        "Error submitting join request:",
        err.response?.data || err,
      );

      return {
        success: false,
        message: err.response?.data?.message || "Failed to submit request",
      };
    }
  };

  // =====================================================
  // 8. UPDATE USER PROFILE
  // =====================================================

  const updateProfile = async (updatedProfile) => {
    try {
      const userId = currentUser?._id || currentUser?.id;

      let payload;

      // -------------------------------------------------
      // FORM DATA
      // -------------------------------------------------

      if (updatedProfile instanceof FormData) {
        payload = updatedProfile;

        if (!payload.has("userId")) {
          payload.append("userId", userId);
        }
      }

      // -------------------------------------------------
      // NORMAL OBJECT
      // -------------------------------------------------
      else {
        payload = {
          userId,
          ...updatedProfile,
        };
      }

      // -------------------------------------------------
      // UPDATE PROFILE API
      // -------------------------------------------------

      const res = await axios.put(`${API_URL}/auth/profile`, payload);

      const user = res.data.user || res.data;

      setCurrentUser(user);

      return {
        success: true,
        user,
      };
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err);

      return {
        success: false,
        message: err.response?.data?.message || "Update failed",
      };
    }
  };

  // =====================================================
  // 9. TOGGLE BOOKMARK
  // =====================================================

  const toggleBookmark = (startupId) => {
    setBookmarks((prev) => {
      const safeBookmarks = Array.isArray(prev) ? prev : [];

      // -------------------------------------------------
      // REMOVE BOOKMARK
      // -------------------------------------------------

      if (safeBookmarks.includes(startupId)) {
        return safeBookmarks.filter((id) => id !== startupId);
      }

      // -------------------------------------------------
      // ADD BOOKMARK
      // -------------------------------------------------

      return [...safeBookmarks, startupId];
    });
  };

  // =====================================================
  // APP CONTEXT PROVIDER
  // =====================================================

  return (
    <AppContext.Provider
      value={{
        // -------------------------------------------------
        // USER
        // -------------------------------------------------

        currentUser,

        // -------------------------------------------------
        // DATA
        // -------------------------------------------------

        startups,
        joinRequests,
        bookmarks,

        // -------------------------------------------------
        // LOADING
        // -------------------------------------------------

        loading,

        // -------------------------------------------------
        // BOOKMARK
        // -------------------------------------------------

        toggleBookmark,

        // -------------------------------------------------
        // JOIN REQUESTS
        // -------------------------------------------------

        submitJoinRequest,
        fetchUserRequests,

        // -------------------------------------------------
        // PROFILE
        // -------------------------------------------------

        updateProfile,

        // -------------------------------------------------
        // AUTHENTICATION
        // -------------------------------------------------

        login,
        register,
        logout,

        // -------------------------------------------------
        // STARTUP
        // -------------------------------------------------

        fetchStartups,

        // -------------------------------------------------
        // STATE SETTER
        // -------------------------------------------------

        setJoinRequests,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// =====================================================
// USE APP HOOK
// =====================================================

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}
