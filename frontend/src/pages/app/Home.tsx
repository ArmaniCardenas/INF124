import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);

  useEffect(() => {
    const fetchUserData = async () => {
//       try {
//         const { data } = await axios.get(
//           "http://localhost:4000/user-data", // New endpoint to fetch user data
//           { withCredentials: true }
//         );
//         setUsername(data.username); // Assuming your backend returns the username
//         toast(`Hello ${data.username}`, {
//           position: "top-right",
//         });
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         removeCookie("token");
//         navigate("/login");
//       }
    };

    fetchUserData();
  }, [cookies, navigate, removeCookie]);

  const Logout = async () => {
    try {
      // Send a request to the backend's /logout endpoint
      const response = await axios.post(
        "http://localhost:4000/logout",
        {},
        { withCredentials: true } // To send the httpOnly cookie
      );

      const { success, message } = response.data;

      if (success) {
        // removeCookie("token"); // Optionally remove client-side reference (though backend should handle)
        navigate("/login");
        toast.success(message, { position: "top-right" });
      } else {
        toast.error(message, { position: "top-right" });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout.", { position: "top-right" });
    }
  };

  return (
    <div className="home_page">
      <h4>
        Welcome User
      </h4>
      <button onClick={Logout}>LOGOUT</button>
      <ToastContainer />
    </div>
  );
};

export default Home;