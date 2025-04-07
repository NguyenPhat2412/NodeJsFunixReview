import { useState } from "react";
import "../public/forms.css";
import axios from "axios";
const AppProduct = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // ham xu ly submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !title.trim() ||
      !image.trim() ||
      !price.trim() ||
      !description.trim()
    ) {
      alert("Please fill all fields!");
      return;
    }
    await axios.post("http://localhost:5000/add-product", {
      title,
      image,
      price,
      description,
    });
    setTitle("");
    setImage("");
    setPrice("");
    setDescription("");
    alert("Product added successfully!");
  };

  return (
    <main>
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="image">Image Url</label>
          <input
            type="text"
            name="image"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="price">Price</label>
          <input
            type="text"
            name="price"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button className="btn" type="submit">
          Add Product
        </button>
      </form>
    </main>
  );
};
export default AppProduct;
