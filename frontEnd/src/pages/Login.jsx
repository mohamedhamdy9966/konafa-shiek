import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [currentState, setCurrentState] = useState("Login");
  const { navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "SignUp") {
        // Handle user sign-up
        const signUpResponse = await axios.post(
          backendUrl + "/api/user/register",
          { name, email, password }
        );
        if (signUpResponse.data.success) {
          const { token, userId } = signUpResponse.data;
          setToken(token);
          localStorage.setItem("userId", userId);
          localStorage.setItem("token", token);
          toast.success("Account created successfully!");
          navigate("/"); // Redirect to home page after sign-up
        } else {
          toast.error(signUpResponse.data.message);
        }
      } else {
        // Check if the credentials are for an admin
        const adminResponse = await axios.post(backendUrl + "/api/user/admin", {
          email,
          password,
        });

        if (adminResponse.data.success) {
          const adminToken = "admin_" + adminResponse.data.token; // Prefix token with "admin_"
          setToken(adminToken);
          localStorage.setItem("token", adminToken);
          navigate("/admin"); // Redirect to admin panel
          return;
        }

        // If not admin, try regular user login
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (response.data.success) {
          const { token, userId } = response.data;
          setToken(token);
          localStorage.setItem("userId", userId);
          localStorage.setItem("token", token);
          toast.success("Logged in successfully!");
          navigate("/"); // Redirect to home page after login
        } else {
          toast.error(response.data.message);
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
                onChange={(e) => setName(e.target.value)}
                value={name}
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
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              placeholder="Password"
              required
            />
          </div>
          <div className="w-full flex justify-between text-sm mt-[-8px] mb-4">
            <p className="cursor-pointer">Forgot Your Password?</p>
            {currentState === "Login" ? (
              <p
                onClick={() => setCurrentState("SignUp")}
                className="cursor-pointer text-blue-500"
              >
                Create Account
              </p>
            ) : (
              <p
                onClick={() => setCurrentState("Login")}
                className="cursor-pointer text-blue-500"
              >
                Login Here
              </p>
            )}
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