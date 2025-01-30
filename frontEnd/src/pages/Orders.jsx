import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID is missing. Please log in.");
        return;
      }
      if (!token) {
        return null;
      }
      const response = await axios.get(backendUrl + "/api/order/userorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            if (!item.image || item.image.length === 0) {
              item["image"] = "../assets/Knafe_on_a_plate.jpeg"; // Change to string
            }
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"طلباتي"} text2={"السابقة"} />
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div>
          {orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20"
                  src={item.image}
                  alt="imageProduct"
                  onError={(e) => {
                    e.target.src = "../assets/konafa_1.png";
                  }}
                />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p>العدد : {item.quantity}</p>
                    <p>الحجم : {item.size}</p>
                  </div>
                  {item.sauceSize > 0 && (
                    <p className="mt-1">
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
                    <p className="mt-1">نوع الصوص: {item.selectedSauce.join(", ")}</p>
                  )}
                  <p className="mt-1">
                    التاريخ:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className="mt-1">
                    طريقة الدفع:{" "}
                    <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                <button
                  onClick={loadOrderData}
                  className="border px-4 py-4 text-sm font-medium rounded-sm"
                >
                  حالة الطلب
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
