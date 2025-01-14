import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "SignUp") {
        const signUpResponse = await axios.post(
          backendUrl + "/api/user/register",
          { name, email, password }
        );
        if (signUpResponse.data.success) {
          const { token, userId } = signUpResponse.data;
          setToken(token);
          localStorage.setItem("userId", userId);
          localStorage.setItem("token", token);
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
          setToken(adminResponse.data.token);
          localStorage.setItem("token", adminResponse.data.token);
          navigate('/admin'); // Redirect to admin panel
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
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      autoComplete="true"
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="userName"
            required
          />
        </>
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="password"
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot Your Password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("SignUp")}
            className="cursor-pointer"
          >
            Create Account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === "Login" ? "Sign In" : "SignUP"}
      </button>
    </form>
  );
};

export default Login;