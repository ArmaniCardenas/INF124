import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./../../context/AuthContext";
import axios from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";


const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  

  const [email, setEmail] = useState(user?.email);
  const [username, setUsername] = useState(user?.username);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const updateUsername = async () => {
    try {
      const response = await axios.patch(
        '/profile/newUsername',
        { username }, // request body
        { withCredentials: true } // if you're using cookies for auth
      );
      console.log(response);
      setUsername(response.data.user.username);

      toast.success('Username updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Error updating username.');
    }
  };

  const updateEmail = async () => {
    try {
      const response = await axios.patch(
        '/profile/newEmail',
        { email }, // request body
        { withCredentials: true } //  cookies for auth
      );
      console.log(response);
      setEmail(response.data.user.email);

      toast.success('Email updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Error updating Email.');
    }
  };

  const updatePassword = async () => {
    try {
      console.log("new password: ", newPassword);
      console.log("current password: ", currentPassword);

      const response = await axios.patch(
        '/profile/newPassword',
        { currentPassword, newPassword }, // request body
        { withCredentials: true } //  cookies for auth
      );
      toast.success('Password updated successfully!');
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      toast.error('Error updating Password.');
    }
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Sidebar */}
      <nav className="w-1/4 bg-gray-100 dark:bg-gray-800 p-6">
        <h2 className="text-xl font-bold mb-6">Settings</h2>
        <ul className="space-y-4">
          <li>
            <button onClick={() => navigate("/home")} className="text-left w-full hover:underline">
              Home
            </button>
          </li>
          <li>
            <button 
              onClick={async ()=> {
                await logout();
                navigate("/")
                        
              }} 
              className="text-left w-full hover:underline text-red-500"
              >
                Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>

        <div className="space-y-6 max-w-md">

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-md bg-white text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={updateUsername}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded-md bg-white text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={updateEmail}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded-md bg-white text-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label className="block text-sm font-medium mb-1"> Current Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded-md bg-white text-black"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              onClick={updatePassword}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors ${
                darkMode ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <ToastContainer/>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
