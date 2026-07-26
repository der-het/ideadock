import React, { useState } from "react";
import axios from "axios";
import { Send, MessageCircle, X, Clock, CheckCircle } from "lucide-react";

export default function StartupCard({ startup, userRequest }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleRequested, setRoleRequested] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Track status locally based on prop ("none" | "pending" | "approved")
  const [status, setStatus] = useState(
    userRequest ? userRequest.status.toLowerCase() : "none",
  );

  const handleSendPitch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/join-requests",
        {
          startupId: startup._id,
          roleRequested,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sc_token")}`,
          },
        },
      );

      if (response.data.success) {
        setStatus("pending");
        setIsModalOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit pitch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-2xs space-y-4 text-left">
      <div>
        <h3 className="text-lg font-bold text-gray-900">
          {startup.startupName}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {startup.description}
        </p>
      </div>

      {/* Dynamic Action Button based on request state */}
      <div className="pt-2">
        {status === "approved" ? (
          <a
            href={`https://wa.me/${startup.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        ) : status === "pending" ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold">
            <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>Pitch Pending Admin Review...</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Pitch</span>
          </button>
        )}
      </div>

      {/* Send Pitch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-100 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-gray-900">
              Pitch to {startup.startupName}
            </h3>

            <form onSubmit={handleSendPitch} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Role Requested
                </label>
                <input
                  type="text"
                  required
                  value={roleRequested}
                  onChange={(e) => setRoleRequested(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Introduction Message
                </label>
                <textarea
                  rows="4"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Why are you a good fit for this venture?"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Submit Pitch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
