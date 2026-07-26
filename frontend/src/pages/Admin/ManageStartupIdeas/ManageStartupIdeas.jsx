import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Lightbulb,
  Search,
  Trash,
  Rocket,
  Shield,
  Activity,
  Award,
  BookOpen,
  RefreshCw,
  Layers,
  Plus,
  X,
} from "lucide-react";
import "./ManageStartupIdeas.css";

export default function ManageStartupIdeas() {
  // ALL HOOKS FIRST
  const [ideasData, setIdeasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Updated state matching all Mongoose schema requirements
  const [newStartup, setNewStartup] = useState({
    startupName: "",
    founderName: "",
    founderEmail: "",
    whatsappNumber: "",
    category: "Sustainability",
    seatsNeeded: 1,
    requiredSkills: "React, Node.js",
    description: "",
    status: "approved",
  });

  const getCategoryTheme = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("sustain") || cat.includes("green"))
      return { icon: Rocket, color: "#004ac6" };
    if (cat.includes("health") || cat.includes("bio"))
      return { icon: Activity, color: "#004ac6" };
    if (cat.includes("fin") || cat.includes("crypto") || cat.includes("web3"))
      return { icon: Shield, color: "#ba1a1a" };
    if (cat.includes("ed") || cat.includes("learn"))
      return { icon: BookOpen, color: "#943700" };
    return { icon: Award, color: "#004ac6" };
  };

  const fetchStartupIdeas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/startups",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sc_token")}`,
          },
        },
      );

      const rawData = response.data?.startups || response.data || [];
      if (Array.isArray(rawData)) {
        formatAndSetIdeas(rawData);
      } else {
        setIdeasData([]);
      }
    } catch (err) {
      console.warn("Backend startup endpoint unreachable:", err.message);
      setIdeasData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatAndSetIdeas = (list) => {
    const formatted = list.map((item, index) => {
      const categoryName =
        typeof item.category === "object"
          ? item.category?.name
          : item.category || "General";

      const theme = getCategoryTheme(categoryName);

      return {
        id: item._id || item.id || index + 1,
        name: item.startupName || item.title || item.name || "Untitled Venture",
        founder:
          item.founderName ||
          item.user?.name ||
          item.founder?.name ||
          item.ownerName ||
          "Anonymous Founder",
        email:
          item.founderEmail ||
          item.user?.email ||
          item.founder?.email ||
          item.contactEmail ||
          "no-email@startup.io",
        category: categoryName,
        datePosted: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recent",
        status: item.status ? item.status.trim() : "approved",
        icon: theme.icon,
        iconColor: theme.color,
      };
    });

    setIdeasData(formatted);
  };

  useEffect(() => {
    fetchStartupIdeas();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/startups/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("sc_token")}`,
        },
      });
      setIdeasData((prev) => prev.filter((idea) => idea.id !== id));
    } catch (err) {
      console.error("Failed to delete startup:", err);
      setIdeasData((prev) => prev.filter((idea) => idea.id !== id));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newStartup.startupName.trim() || !newStartup.whatsappNumber.trim())
      return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/startups",
        newStartup,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sc_token")}`,
          },
        },
      );

      if (response.data?.success || response.status === 201) {
        fetchStartupIdeas();
      }
    } catch (err) {
      console.error("Failed to add startup:", err);
      alert(err.response?.data?.message || "Failed to create startup idea.");
    }

    setIsModalOpen(false);
    setNewStartup({
      startupName: "",
      founderName: "",
      founderEmail: "",
      whatsappNumber: "",
      category: "Sustainability",
      seatsNeeded: 1,
      requiredSkills: "React, Node.js",
      description: "",
      status: "approved",
    });
  };

  const categoriesList = [
    "All",
    ...new Set(ideasData.map((idea) => idea.category)),
  ];

  const filteredIdeas = ideasData.filter((idea) => {
    const matchesSearch =
      idea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.founder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || idea.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" ||
      idea.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="manage-ideas-page space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Manage Startup Ideas
          </h2>
          <p className="text-gray-500 text-xs mt-0.5">
            Review, approve, and moderate submitted startup concepts.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStartupIdeas}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-black transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${
              loading ? "animate-spin text-indigo-600" : "text-gray-500"
            }`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metric Card & Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs flex flex-col justify-between w-full sm:w-80">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Lightbulb className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Live DB
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
              TOTAL IDEAS
            </p>
            <h3 className="text-2xl font-black text-gray-900 font-mono mt-0.5">
              {ideasData.length}
            </h3>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Startup Concept</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-2xs overflow-hidden">
        {/* Search & Filters */}
        {/* <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by startup or founder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black transition-all"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-black"
            >
              {categoriesList.map((cat, i) => (
                <option key={i} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-black"
            >
              <option value="All">Status: All</option>
              <option value="approved">Status: Approved</option>
              <option value="pending">Status: Pending</option>
            </select>
          </div>
        </div> */}

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase font-mono tracking-wider">
                <th className="py-3.5 px-4">Startup Name</th>
                <th className="py-3.5 px-4">Category</th>
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
                    Fetching startups from database...
                  </td>
                </tr>
              ) : filteredIdeas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Layers className="w-8 h-8 text-gray-300 mx-auto" />
                      <p className="font-bold text-gray-700">
                        No startup ideas found
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Click "Add Startup Concept" to create your first entry.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIdeas.map((idea) => {
                  const StartupIcon = idea.icon;
                  const isPending = idea.status.toLowerCase() === "pending";

                  return (
                    <tr
                      key={idea.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
                          style={{
                            color: idea.iconColor,
                            backgroundColor: `${idea.iconColor}15`,
                          }}
                        >
                          <StartupIcon className="w-4 h-4" />
                        </div>
                        <span className="truncate max-w-[180px]">
                          {idea.name}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-gray-500 font-mono text-[11px]">
                        {idea.datePosted}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono capitalize ${
                            isPending
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPending ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                          />
                          {idea.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(idea.id, idea.name)}
                          title="Delete Idea"
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash className="w-4 h-4" />
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
            Showing 1-{filteredIdeas.length} of {ideasData.length} entries
          </span>
        </div>
      </div>

      {/* Add Startup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-100 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900">
                Add Startup Concept
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-900 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Startup Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EcoStream AI"
                  value={newStartup.startupName}
                  onChange={(e) =>
                    setNewStartup({
                      ...newStartup,
                      startupName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Founder Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Marcus Chen"
                    value={newStartup.founderName}
                    onChange={(e) =>
                      setNewStartup({
                        ...newStartup,
                        founderName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+1234567890"
                    value={newStartup.whatsappNumber}
                    onChange={(e) =>
                      setNewStartup({
                        ...newStartup,
                        whatsappNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Founder Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="marcus@ecostream.ai"
                  value={newStartup.founderEmail}
                  onChange={(e) =>
                    setNewStartup({
                      ...newStartup,
                      founderEmail: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newStartup.category}
                    onChange={(e) =>
                      setNewStartup({
                        ...newStartup,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black font-bold"
                  >
                    <option value="Sustainability">Sustainability</option>
                    <option value="Healthtech">Healthtech</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Edtech">Edtech</option>
                    <option value="AI/ML">AI/ML</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Seats Needed
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newStartup.seatsNeeded}
                    onChange={(e) =>
                      setNewStartup({
                        ...newStartup,
                        seatsNeeded: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, Python"
                  value={newStartup.requiredSkills}
                  onChange={(e) =>
                    setNewStartup({
                      ...newStartup,
                      requiredSkills: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newStartup.status}
                    onChange={(e) =>
                      setNewStartup({
                        ...newStartup,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black font-bold"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  required
                  placeholder="Brief overview of the startup..."
                  value={newStartup.description}
                  onChange={(e) =>
                    setNewStartup({
                      ...newStartup,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"
                ></textarea>
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
                  Save Startup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
