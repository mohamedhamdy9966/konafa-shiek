// src/components/DeleteAccount.js
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      try {
        await axios.delete("/api/users/delete", { withCredentials: true });
        alert("Account deleted successfully.");
        navigate("/signup-login");
      } catch (err) {
        alert("Failed to delete account.");
        console.log(err);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Delete My Account
    </button>
  );
};

export default DeleteAccount;
