import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const List = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching dishes");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(
        `${url}/api/food/remove`,
        { id: foodId },
        { headers: { token } }
      );
      await fetchList();
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Error removing food");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchList();
  }, [admin, token, navigate]);

  return (
    <div className="list add flex-col">
      <p>All Food Dishes ({list.length} items)</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Restaurant</b>
          <b>Category</b>
          <b>Price (&#8377;)</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={item._id || index} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt={item.name} />
              <p>{item.name}</p>
              <p style={{ fontSize: "12px", color: "#e5412b" }}>{item.restaurant || "Bawarchi Biryani House"}</p>
              <p>{item.category}</p>
              <p style={{ fontWeight: "600", color: "#2e7d32" }}>&#8377;{item.price}</p>
              <p onClick={() => removeFood(item._id)} className="cursor">
                ❌
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
