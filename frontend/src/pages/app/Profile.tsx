import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    // Example: remove auth cookies or tokens here
    navigate("/logout");
  };

  const handleSave = () => {
    console.log("Saving:", { email, password });
    // TODO: Call backend to update credentials
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
            <button onClick={handleLogout} className="text-left w-full hover:underline text-red-500">
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
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded-md bg-white text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded-md bg-white text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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


          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
