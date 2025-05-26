import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { backendUrl, currency } from "../App";
import parcel from "../assets/parcel_icon.svg";
import { io } from "socket.io-client";
import notificationSound from "../assets/notification.wav";

const socketServerUrl = "https://konafa-shiek-notify.onrender.com";

const AdminOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audio, setAudio] = useState(null);

  // Fetch all orders
  const fetchAllOrders = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendUrl}/api/order`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100 },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error loading orders:", err.message);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle order status change
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("تم تحديث حالة الطلب بنجاح !");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل في تحديث حالة الطلب !");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Preload audio once
  useEffect(() => {
    const audioInstance = new Audio(notificationSound);
    audioInstance.load();
    setAudio(audioInstance);

    return () => {
      audioInstance.pause();
    };
  }, []);

  // Initialize socket once
  useEffect(() => {
    if (!token) return;

    const newSocket = io(socketServerUrl, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      timeout: 20000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        newSocket.connect();
      }
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection Error:", err.message);
      toast.error("فشل في الاتصال بالخادم! جاري إعادة المحاولة...");
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("connect_error");
      newSocket.close();
    };
  }, [token]);

  // Handle new order socket event
  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (order) => {
      if (audioEnabled && audio) {
        audio.play().catch((err) => {
          console.error("فشل تشغيل الصوت:", err);
          setAudioEnabled(false);
          toast.info("الرجاء تفعيل الصوت للإشعارات", {
            onClick: () => setAudioEnabled(true),
          });
        });
      }

      toast.info(`طلب جديد من ${order.address.firstName}`, {
        position: "top-left",
        rtl: true,
      });

      setOrders((prev) => {
        const exists = prev.some((o) => o._id === order._id);
        return exists ? prev : [order, ...prev];
      });
    };

    socket.on("new_order", handleNewOrder);

    return () => {
      socket.off("new_order", handleNewOrder);
    };
  }, [socket, audioEnabled, audio]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h3 className="text-lg font-bold mb-4">الطلبات الواردة</h3>

      <button
        onClick={fetchAllOrders}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        تحديث الطلبات
      </button>

      {!audioEnabled && (
        <button
          onClick={() => {
            setAudioEnabled(true);
            if (audio) {
              audio
                .play()
                .then(() => {
                  toast.success("تم تفعيل إشعارات الصوت!");
                })
                .catch((err) => {
                  console.error("Failed to play sound:", err);
                  toast.error("يرجى السماح بتشغيل الصوت في المتصفح");
                  setAudioEnabled(false);
                });
            }
          }}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          تفعيل إشعارات الصوت 🔔
        </button>
      )}

      <div>
        {orders.map((order) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={order._id}
          >
            <img className="w-12" src={parcel} alt="parcel" />
            <div>
              <div>
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <p className="py-0.5">
                      {item.name} X {item.quantity} <span>{item.size}</span>
                    </p>
                    {item.sauceSize > 0 && (
                      <p className="text-sm">
                        حجم الصوص:{" "}
                        {item.sauceSize === 4
                          ? "XS"
                          : item.sauceSize === 5
                          ? "S"
                          : item.sauceSize === 10
                          ? "M"
                          : "L"}
                      </p>
                    )}
                    {item.selectedSauce?.length > 0 && (
                      <p className="text-sm">
                        أنواع الصوصات: {item.selectedSauce.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-3 mb-2 font-medium">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div>
                <p>{order.address.street},</p>
              </div>
              <p>{order.address.state}</p>
              <p>{order.address.phone}</p>
              <p>
                {order.deliveryMethod === "delivery"
                  ? "توصيل"
                  : "استلام من الفرع"}
              </p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                عدد الطلبات {order.items.length}
              </p>
              <p className="mt-3">طريقة الدفع: {order.paymentMethod}</p>
              <p>الدفع: {order.payment ? "تم الدفع" : "لم يتم الدفع"}</p>
              <p>
                التاريخ:{" "}
                {new Date(order.date).toLocaleDateString("ar-SA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <p className="text-sm sm:text-[15px] font-bold text-green-600">
              {currency || "$"}
              {order.amount}
            </p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold rounded border border-gray-300"
            >
              <option value="Order Placed">تم الطلب</option>
              <option value="Packing">في التعبئة</option>
              <option value="Ready">جاهز للإستلام</option>
              <option value="Delivered">تم الإستلام</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
