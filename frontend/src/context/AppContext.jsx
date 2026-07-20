import { createContext, useContext, useState, useEffect } from "react";
import { STARTUPS, USER_SARAH, USER_ALEX } from "../constants/data.js";

const AppContext = createContext();

export function AppProvider({ children }) {
  // Try to load state from localStorage or use defaults
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("sc_user");
    return saved ? JSON.parse(saved) : USER_SARAH;
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("sc_bookmarks");
    return saved ? JSON.parse(saved) : ["solarisgrid", "neuralpath"];
  });

  const [joinRequests, setJoinRequests] = useState(() => {
    const saved = localStorage.getItem("sc_join_requests");
    return saved ? JSON.parse(saved) : [];
  });

  const [startups, setStartups] = useState(() => {
    const saved = localStorage.getItem("sc_startups");
    return saved ? JSON.parse(saved) : STARTUPS;
  });

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("sc_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("sc_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("sc_join_requests", JSON.stringify(joinRequests));
  }, [joinRequests]);

  useEffect(() => {
    localStorage.setItem("sc_startups", JSON.stringify(startups));
  }, [startups]);

  // Actions
  const toggleBookmark = (startupId) => {
    setBookmarks((prev) => {
      if (prev.includes(startupId)) {
        return prev.filter((id) => id !== startupId);
      } else {
        return [...prev, startupId];
      }
    });
  };

  const submitJoinRequest = (startupId, roleId, roleTitle, note = "") => {
    const newRequest = {
      id: `req-${Date.now()}`,
      startupId,
      roleId,
      roleTitle,
      note,
      status: "pending", // 'pending', 'approved', 'declined'
      timestamp: new Date().toISOString(),
    };
    setJoinRequests((prev) => [newRequest, ...prev]);
  };

  const updateProfile = (updatedProfile) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedProfile,
    }));
  };

  const login = (email, password) => {
    // Basic mock authentication
    const mockUser = email.toLowerCase().includes("alex")
      ? USER_ALEX
      : {
          ...USER_SARAH,
          name:
            email
              .split("@")[0]
              .split(".")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ") || "User",
        };
    setCurrentUser(mockUser);
    return mockUser;
  };

  const register = (userData) => {
    const newUser = {
      ...USER_SARAH,
      name: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      title: "Aspiring Collaborator",
      skills: [],
      experience: [],
      projects: [],
      stats: {
        completedProjects: 0,
        teamsJoined: 0,
        bookmarks: 0,
        endorsements: 0,
      },
    };
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        bookmarks,
        joinRequests,
        startups,
        toggleBookmark,
        submitJoinRequest,
        updateProfile,
        login,
        register,
        logout,
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
