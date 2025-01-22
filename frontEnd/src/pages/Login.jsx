import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [currentState, setCurrentState] = useState("Login");
  const { navigate, backendUrl } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserLogin = async () => {
    const { email, password } = formData;
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
      });
      if (response.data.success) {
        await handleSuccess(response.data, "/");
        toast.success("Logged in successfully!");
      }
    } catch (err) {
      throw new Error("Invalid user credentials");
    }
  };

  const handleAdminLogin = async () => {
    const { email, password } = formData;
    try {
      const response = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password,
      });
      if (response.data.success) {
        await handleSuccess(response.data, "/add");
        toast.success("Admin logged in successfully!");
      }
    } catch (err) {
      throw new Error("Invalid admin credentials");
    }
  };

  const handleSignUp = async () => {
    const { name, email, password } = formData;
    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, {
        name,
        email,
        password,
      });
      if (response.data.success) {
        await handleSuccess(response.data, "/");
        toast.success("Account created successfully!");
      } else {
        toast.error(response.data.message || "Sign-up failed");
      }
    } catch (err) {
      toast.error(err.message || "Sign-up failed");
    }
  };

  const handleSuccess = async (data, redirectPath) => {
    const { token, userId } = data;
    setToken(token);
    localStorage.setItem("token", token);
    if (userId) localStorage.setItem("userId", userId);
    navigate(redirectPath);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currentState === "SignUp") {
        await handleSignUp();
      } else {
        try {
          await handleUserLogin();
        } catch {
          await handleAdminLogin();
        }
      }
    } catch (error) {
      toast.error(error.message);
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
                placeholder="Name"
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
              placeholder="Email"
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
              placeholder="Password"
              required
            />
          </div>
          <div className="w-full flex justify-between text-sm mt-[-8px] mb-4">
            <p className="cursor-pointer">Forgot Your Password?</p>
            <p
              onClick={() =>
                setCurrentState((prev) =>
                  prev === "Login" ? "SignUp" : "Login"
                )
              }
              className="cursor-pointer text-blue-500"
            >
              {currentState === "Login" ? "Create Account" : "Login Here"}
            </p>
          </div>
          <button
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black"
            type="submit"
          >
            {currentState === "Login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;