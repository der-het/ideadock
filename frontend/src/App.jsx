import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useEffect } from "react";

import { AppProvider, useApp } from "./context/AppContext.jsx";

// Layout
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";

// Public Pages
import Landing from "./pages/Landing/Landing.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import BrowseStartups from "./pages/BrowseStartups/BrowseStartups.jsx";
import StartupDetails from "./pages/StartupDetails/StartupDetails.jsx";
import Profile from "./pages/Profile/Profile.jsx";

// Admin Layout
import AdminLayout from "./components/admin/AdminLayout/AdminLayout.jsx";

// Admin Pages
import ManageUsers from "./pages/Admin/ManageUsers/ManageUsers.jsx";
import ManageStartupIdeas from "./pages/Admin/ManageStartupIdeas/ManageStartupIdeas.jsx";
import ManageCategories from "./pages/Admin/ManageCategories/ManageCategories.jsx";
import ManageJoinRequests from "./pages/Admin/ManageJoinRequests/ManageJoinRequests.jsx";
import Reports from "./pages/Admin/Reports/Reports.jsx";

// Admin Route Guard Component
function AdminRoute() {
  const { currentUser, user } = useApp();
  const activeUser = currentUser || user;

  if (!activeUser || activeUser.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function LayoutWrapper({ children }) {
  const location = useLocation();

  // Hide top navbar only on login/register pages
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  // Hide footer on auth pages and admin routes
  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}

      <div className="flex-grow">{children}</div>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />

        <LayoutWrapper>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/browse" element={<BrowseStartups />} />
            <Route path="/startup" element={<StartupDetails />} />
            <Route path="/startup/:id" element={<StartupDetails />} />
            <Route path="/profile" element={<Profile />} />

            {/* Protected Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                {/* Default route redirects to /admin/startups */}
                <Route
                  index
                  element={<Navigate to="/admin/startups" replace />}
                />
                <Route path="startups" element={<ManageStartupIdeas />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="categories" element={<ManageCategories />} />
                <Route path="requests" element={<ManageJoinRequests />} />
                <Route path="reports" element={<Reports />} />
              </Route>
            </Route>
          </Routes>
        </LayoutWrapper>
      </Router>
    </AppProvider>
  );
}
