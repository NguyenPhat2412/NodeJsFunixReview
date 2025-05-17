import { useState } from "react";
const NewPosts = ({ showForm, setShowForm }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  // Xử lý createPost
  const handleCreatePost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    formData.append("content", content);

    // Kiểm tra dữ liệu
    if (!title || !image || !content) {
      alert("Please fill in all fields.");
      return;
    }
    // Gửi dữ liệu đến server
    try {
      const response = await fetch("http://localhost:8080/auth/posts", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert("Post created successfully!");
        // Reset form fields
        setTitle("");
        setImage("");
        setContent("");
      } else {
        alert("Error creating post: " + data.message);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Xử lý nút Cancel
  const handleCancel = () => {
    setTitle("");
    setImage(null);
    setContent("");
    setShowForm(false);
  };

  return (
    <div className="new-posts">
      {showForm && (
        <div className="border justify-center items-center bg-gray-100 w-150 rounded-lg shadow-lg">
          <p className="text-2xl font-bold border-b px-4 py-4 text-purple-800">
            New Posts
          </p>
          <div className="flex justify-center mt-5 ">
            <div className="flex flex-col">
              <div className="flex flex-col px-4">
                <label className="text-xl">TITLE</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border p-2 mb-2 w-140"
                />
              </div>
              <div className="flex flex-col px-4">
                <label className="text-xl">IMAGE</label>
                <input
                  type="file"
                  placeholder="Image URL"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="border p-2 mb-2 w-140"
                />
                <p>Please choose an image</p>
              </div>

              <div className="flex flex-col px-4">
                <label className="text-xl">CONTENT</label>
                <textarea
                  placeholder="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="border p-2 mb-2 w-140"
                ></textarea>
              </div>
              <div className="flex flex-row gap-4 r-0 justify-end pe-4 pb-4">
                <button
                  className="text-red-500 hover:bg-blue-700 font-bold py-2 px-4"
                  onClick={() => handleCancel(true)}
                >
                  CANCEL
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleCreatePost}
                >
                  ACCEPT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default NewPosts;
