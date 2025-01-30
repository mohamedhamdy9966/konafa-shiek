import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [currentState, setCurrentState] = useState("Login");
  const { navigate, backendUrl } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuth = async (url, successMessage, redirectPath) => {
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}${url}`, formData);
      if (response.data.success) {
        await handleSuccess(response.data, redirectPath);
        toast.success(successMessage);
      }
    } catch (err) {
      toast.error("Invalid credentials or sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = async (data, redirectPath) => {
    const { token, userId } = data;
    setToken(token);
    localStorage.setItem("token", token);
    if (userId) localStorage.setItem("userId", userId);
    navigate(redirectPath);
    window.location.reload();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (currentState === "SignUp") {
      await handleAuth("/api/user/register", "Account created successfully!", "/");
    } else {
      try {
        await handleAuth("/api/user/login", "Logged in successfully!", "/");
      } catch {
        await handleAuth("/api/user/admin", "Admin logged in successfully!", "/add");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {currentState === "Login" ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={onSubmitHandler} autoComplete="true">
          {currentState === "SignUp" && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Name</p>
              <input
                name="name"
                onChange={handleChange}
                value={formData.name}
                type="text"
                className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                placeholder="Your Name"
                required
              />
            </div>
          )}
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Email</p>
            <input
              name="email"
              onChange={handleChange}
              value={formData.email}
              type="email"
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              placeholder="Your Email"
              required
            />
          </div>
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input
              name="password"
              onChange={handleChange}
              value={formData.password}
              type="password"
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              placeholder="Your Password"
              required
            />
          </div>
          <div className="w-full flex justify-between text-sm mt-[-8px] mb-4">
            <p className="cursor-pointer">Forgot Your Password?</p>
            <p
              onClick={() =>
                setCurrentState((prev) => (prev === "Login" ? "SignUp" : "Login"))
              }
              className="cursor-pointer text-blue-500"
            >
              {currentState === "Login" ? "Create Account" : "Login Here"}
            </p>
          </div>
          <button
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black flex justify-center items-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              currentState === "Login" ? "Sign In" : "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
