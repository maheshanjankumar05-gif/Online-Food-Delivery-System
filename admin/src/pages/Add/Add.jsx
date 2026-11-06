import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Add = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Biryani",
    restaurant: "Bawarchi Biryani House",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!image) {
      toast.error("Please select a product image");
      return;
    }
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("restaurant", data.restaurant);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData, { headers: { token } });
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Biryani",
          restaurant: "Bawarchi Biryani House",
        });
        setImage(false);
        toast.success("Food Added Successfully!");
      } else {
        toast.error(response.data.message || "Failed to add food");
      }
    } catch (err) {
      toast.error("Error adding food item");
    }
  };

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
  }, [admin, token, navigate]);

  return (
    <div className="add">
      <form onSubmit={onSubmitHandler} className="flex-col">
        <div className="add-img-upload flex-col">
          <p>Upload image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="e.g. Chicken Biryani, Butter Naan"
            required
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="4"
            placeholder="Describe the dish ingredients, taste and serving size..."
            required
          ></textarea>
        </div>

        <div className="add-category flex-col" style={{ marginBottom: "15px" }}>
          <p>Select Restaurant / Kitchen</p>
          <select
            name="restaurant"
            required
            onChange={onChangeHandler}
            value={data.restaurant}
          >
            <option value="Bawarchi Biryani House">Bawarchi Biryani House (Biryani & Veg)</option>
            <option value="Little Italy & Pasta Bar">Little Italy & Pasta Bar (Pasta & Italian)</option>
            <option value="Green Bowl Salads & Healthy Co.">Green Bowl Salads & Healthy Co. (Salads & Healthy)</option>
            <option value="Kathi Junction & Rolls">Kathi Junction & Rolls (Rolls & Wraps)</option>
            <option value="Sweet Tooth Bakery & Cafe">Sweet Tooth Bakery & Cafe (Cakes & Desserts)</option>
            <option value="The Gourmet Sandwich Club">The Gourmet Sandwich Club (Sandwiches)</option>
            <option value="The Wok & Noodle Co.">The Wok & Noodle Co. (Noodles & Asian)</option>
          </select>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select
              name="category"
              required
              onChange={onChangeHandler}
              value={data.category}
            >
              <option value="Biryani">Biryani</option>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
              <option value="Beverages">Beverages</option>
              <option value="South Indian">South Indian</option>
              <option value="North Indian">North Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price (&#8377; INR)</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="180"
              required
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
          ADD ITEM
        </button>
      </form>
    </div>
  );
};

export default Add;
