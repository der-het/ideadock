import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

import { AppProvider } from "./context/AppContext.jsx";

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
import AdminDashboard from "./pages/Admin/Dashboard/Dashboard.jsx";
import ManageUsers from "./pages/Admin/ManageUsers/ManageUsers.jsx";
import ManageStartupIdeas from "./pages/Admin/ManageStartupIdeas/ManageStartupIdeas.jsx";
import ManageCategories from "./pages/Admin/ManageCategories/ManageCategories.jsx";
import ManageJoinRequests from "./pages/Admin/ManageJoinRequests/ManageJoinRequests.jsx";
import Reports from "./pages/Admin/Reports/Reports.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function LayoutWrapper({ children }) {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}

      <div className="flex-grow">{children}</div>

      {!hideLayout && <Footer />}
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

            {/* Admin Routes */}

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />

              <Route path="users" element={<ManageUsers />} />

              <Route path="startups" element={<ManageStartupIdeas />} />

              <Route path="categories" element={<ManageCategories />} />

              <Route path="requests" element={<ManageJoinRequests />} />

              <Route path="reports" element={<Reports />} />
            </Route>
          </Routes>
        </LayoutWrapper>
      </Router>
    </AppProvider>
  );
}
