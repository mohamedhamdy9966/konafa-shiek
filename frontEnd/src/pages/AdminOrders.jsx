import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";
import parcel from "../assets/parcel_icon.svg";

const AdminOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllOrders = async () => {
    if (!token) {
      console.warn("Token is not available.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(backendUrl + "/api/order", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched orders:", response.data.orders);
      if (response.data.success) {
        setOrders(response.data.orders);
        // Log each order's date for debugging
        response.data.orders.forEach((order) => {
          console.log("Order date:", new Date(order.date));
        });

        // Log today's date for comparison
        console.log("Today's date:", new Date());
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("حدث خطأ أثناء تحميل الطلبات : ", err.message);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.put(
        backendUrl + "/api/order/status",
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={index}
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
                      <p className="text-sm" key={`sauceSize-${itemIndex}`}>
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
                    {item.selectedSauce && item.selectedSauce.length > 0 && (
                      <p className="text-sm" key={`selectedSauce-${itemIndex}`}>
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
                <p>{order.address.street + ","}</p>
              </div>
              <p>{order.address.state}</p>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                عدد الطلبات {order.items.length}
              </p>
              <p className="mt-3">طريقة الدفع: {order.paymentMethod}</p>
              <p>الدفع: {order.payment ? "Done" : "Pending"}</p>
              <p>التاريخ: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">
              {currency || "$"}
              {order.amount}
            </p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold"
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