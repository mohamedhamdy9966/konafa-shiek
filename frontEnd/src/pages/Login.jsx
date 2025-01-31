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

  const handleUserLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        { timeout: 10000 } // Add timeout
      );
      if (response.data.success) {
        await handleSuccess(response.data, "/");
        toast.success("تم تسجيل الدخول !");
        return true;
      } else {
        toast.error(response.data.message || "فشل تسجيل الدخول");
        return false;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || " فشل تسجيل الدخول إلى حسابك !");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/admin`,
        {
          email: formData.email,
          password: formData.password,
        },
        { timeout: 10000 }
      );
      if (response.data.success) {
        await handleSuccess(response.data, "/add");
        toast.success("تم تسجيل دخول المدير !");
        return true;
      } else {
        toast.error(response.data.message || "فشل تسجيل دخول المدير !");
        return false;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل تسجيل دخول مدير التطبيق !");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/register`,
        formData,
        { timeout: 10000 }
      );
      if (response.data.success) {
        await handleSuccess(response.data, "/");
        toast.success("تم إنشاء حسابك بنجاح !");
      } else {
        toast.error(response.data.message || "حدث خطأ أثناء إنشاء حسابك !");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل في تسجيل حسابك !");
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
    if (loading) return;

    try {
      if (currentState === "SignUp") {
        await handleSignUp();
      } else {
        const userLoginSuccess = await handleUserLogin();
        if (!userLoginSuccess) {
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
                placeholder="إسمك باللغة الإنجليزية"
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
              placeholder="بريدك الإلكتروني"
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
              placeholder="كلمة السر الخاصة بك أكثر من 8 أرقم"
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
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black flex items-center justify-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : currentState === "Login" ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
