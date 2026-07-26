import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  UserCheck,
  Search,
  Trash2,
  UserPlus,
  RefreshCw,
  X,
  Layers,
} from "lucide-react";
import "./ManageUsers.css";

export default function ManageUsers() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Modal State for Adding User
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member",
    title: "",
    location: "",
  });

  // Fetch users from database API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sc_token")}`,
          },
        },
      );

      const data = response.data?.users || response.data || [];
      // Filter out admins immediately upon fetching
      const nonAdminUsers = Array.isArray(data)
        ? data.filter((user) => (user.role || "").toLowerCase() !== "admin")
        : [];
      setUsersList(nonAdminUsers);
    } catch (err) {
      console.error("Failed to fetch users from database:", err);
      setUsersList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User handler
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("sc_token")}`,
        },
      });
      setUsersList((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user from database.");
    }
  };

  // Handle Add User Form Submit
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/users",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sc_token")}`,
          },
        },
      );

      if (response.data?.success || response.status === 201) {
        fetchUsers();
        setIsModalOpen(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "Member",
          title: "",
          location: "",
        });
      }
    } catch (err) {
      console.error("Failed to add user:", err);
      alert(err.response?.data?.message || "Failed to create user.");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(usersList.map((u) => u._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  // Filtered Users computation
  const filteredUsers = usersList.filter((user) => {
    const matchesSearch =
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "All" ||
      (user.role || "").toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const totalUsersCount = usersList.length;
  const activeUsersCount = usersList.filter(
    (u) => (u.status || "Active").toLowerCase() === "active",
  ).length;

  return (
    <div className="manage-users-page space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Manage Users
          </h2>
          <p className="text-gray-500 text-xs mt-0.5">
            Oversee community members, adjust roles, and manage account
            statuses.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={fetchUsers}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                loading ? "animate-spin text-indigo-600" : "text-gray-500"
              }`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Bento Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs flex justify-between items-center">
          <div>
            <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
              TOTAL USERS
            </p>
            <h3 className="text-2xl font-black text-gray-900 font-mono mt-0.5">
              {totalUsersCount.toLocaleString()}
            </h3>
          </div>
          <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            +12%
          </span>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs flex justify-between items-center">
          <div>
            <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
              ACTIVE NOW
            </p>
            <h3 className="text-2xl font-black text-gray-900 font-mono mt-0.5">
              {activeUsersCount || totalUsersCount}
            </h3>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-2xs overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase font-mono tracking-wider">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={
                      usersList.length > 0 &&
                      selectedUsers.length === usersList.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-900 font-medium">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-gray-400 font-mono"
                  >
                    Fetching users from database...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Layers className="w-8 h-8 text-gray-300 mx-auto" />
                      <p className="font-bold text-gray-700">No users found</p>
                      <p className="text-[11px] text-gray-400">
                        No community members match your search criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const name = user.name || "Anonymous Member";
                  const email = user.email || "no-email@startup.io";
                  const role = user.role || "Member";
                  const joinedDate = user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent";
                  const status = user.status || "Active";

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleSelectUser(user._id)}
                        />
                      </td>

                      <td className="py-4 px-4 flex items-center gap-3">
                        <div>
                          <p className="font-bold text-gray-900">{name}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                            {email}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono">
                          {role}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-gray-500 font-mono text-[11px]">
                        {joinedDate}
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user._id, name)}
                          title="Delete User"
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-mono">
          <span>
            Showing 1-{filteredUsers.length} of {usersList.length} entries
          </span>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-100 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900">
                Add New User
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-900 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Peterson"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="jordan@startup.io"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Temporary Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black font-bold"
                  >
                    <option value="Member">Member</option>
                    <option value="Founder">Founder</option>
                    <option value="user">User</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AI Engineer"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
