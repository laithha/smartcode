"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import "./style.css";

interface UserInfo {
  id: number;
  email: string;
  is_admin: boolean;
  username: string | null;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);
  const [updatingVisibility, setUpdatingVisibility] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [updatingUsername, setUpdatingUsername] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    if (!token || !user_id) return;

    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`http://localhost:8000/users/${user_id}`, { headers }).then(r => r.json()),
      fetch(`http://localhost:8000/users/${user_id}/leaderboard-visibility`, { headers }).then(r => r.json()),
    ]).then(([userData, visData]) => {
      const u = userData.user;
      if (u) setUser({ id: u[0], email: u[1], is_admin: u[3], username: u[8] ?? null });
      if (visData.show_on_leaderboard !== undefined) setShowOnLeaderboard(visData.show_on_leaderboard);
    });
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    setChangingPassword(true);
    const res = await fetch(`http://localhost:8000/users/${user_id}/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
    const data = await res.json();
    setChangingPassword(false);
    if (!res.ok) {
      toast.error(data.detail || "Failed to change password");
      return;
    }
    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    setUpdatingUsername(true);
    const res = await fetch(`http://localhost:8000/users/${user_id}/username`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: newUsername }),
    });
    const data = await res.json();
    setUpdatingUsername(false);
    if (!res.ok) {
      toast.error(data.detail || "Failed to update username");
      return;
    }
    setUser((prev) => prev ? { ...prev, username: newUsername } : prev);
    setNewUsername("");
    toast.success("Username updated!");
  };

  const handleLeaderboardToggle = async (value: boolean) => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    setShowOnLeaderboard(value);
    setUpdatingVisibility(true);
    const res = await fetch(`http://localhost:8000/users/${user_id}/leaderboard-visibility`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ show_on_leaderboard: value }),
    });
    setUpdatingVisibility(false);
    if (!res.ok) {
      setShowOnLeaderboard(!value);
      toast.error("Failed to update leaderboard visibility");
      return;
    }
    toast.success(value ? "You are now visible on the leaderboard" : "You are now hidden from the leaderboard");
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    setDeleting(true);
    const res = await fetch(`http://localhost:8000/users/${user_id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeleting(false);
    if (!res.ok) {
      toast.error("Failed to delete account");
      return;
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    toast.success("Account deleted");
    setTimeout(() => router.push("/web/register"), 800);
  };

  return (
    <div className="settings-root">
      <div className="settings-container">

        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-sub">Manage your account preferences</p>
        </div>

        {/* Account Info */}
        <div className="settings-card">
          <h2 className="settings-section-title">Account</h2>
          <div className="settings-info-row">
            <span className="settings-info-label">Email</span>
            <span className="settings-info-value">{user?.email ?? "—"}</span>
          </div>
          <div className="settings-info-row">
            <span className="settings-info-label">Role</span>
            <span className={`settings-badge ${user?.is_admin ? "settings-badge-admin" : "settings-badge-user"}`}>
              {user?.is_admin ? "Admin" : "Student"}
            </span>
          </div>
        </div>

        {/* Username */}
        <div className="settings-card">
          <h2 className="settings-section-title">Display Name</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 16px" }}>
            This is the name shown on the leaderboard.{" "}
            {user?.username ? (
              <>Current: <strong>{user.username}</strong></>
            ) : (
              "You haven't set one yet — your email prefix is used as fallback."
            )}
          </p>
          <form className="settings-form" onSubmit={handleUpdateUsername}>
            <div className="settings-field">
              <label className="settings-label">New Username</label>
              <input
                className="settings-input"
                type="text"
                placeholder="e.g. coder123"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                minLength={3}
                maxLength={50}
                required
              />
            </div>
            <button className="settings-btn" type="submit" disabled={updatingUsername}>
              {updatingUsername ? "Saving..." : "Save Username"}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="settings-card">
          <h2 className="settings-section-title">Change Password</h2>
          <form className="settings-form" onSubmit={handleChangePassword}>
            <div className="settings-field">
              <label className="settings-label">Current Password</label>
              <input
                className="settings-input"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">New Password</label>
              <input
                className="settings-input"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">Confirm New Password</label>
              <input
                className="settings-input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button className="settings-btn" type="submit" disabled={changingPassword}>
              {changingPassword ? "Saving..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Leaderboard Visibility */}
        <div className="settings-card">
          <h2 className="settings-section-title">Privacy</h2>
          <div className="settings-info-row">
            <div>
              <span className="settings-info-label">Show me on the leaderboard</span>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#9ca3af" }}>
                When enabled, your rank and lessons completed are visible to all users.
              </p>
            </div>
            <button
              className={`settings-toggle ${showOnLeaderboard ? "settings-toggle-on" : "settings-toggle-off"}`}
              onClick={() => handleLeaderboardToggle(!showOnLeaderboard)}
              disabled={updatingVisibility}
              aria-label="Toggle leaderboard visibility"
            >
              <span className="settings-toggle-thumb" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-card settings-danger-card">
          <h2 className="settings-section-title settings-danger-title">Danger Zone</h2>
          <p className="settings-danger-desc">
            Permanently delete your account and all progress data. This action cannot be undone.
          </p>
          <button className="settings-btn-danger" onClick={() => setShowDeleteModal(true)}>
            Delete Account
          </button>
        </div>

      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="settings-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="settings-modal-title">Delete account?</h3>
            <p className="settings-modal-desc">
              This will permanently delete your account and all your progress. There is no way to undo this.
            </p>
            <div className="settings-modal-actions">
              <button className="settings-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="settings-modal-confirm" onClick={handleDeleteAccount} disabled={deleting}>
                {deleting ? "Deleting..." : "Yes, delete my account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
