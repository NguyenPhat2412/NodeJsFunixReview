import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../NavBar/NavBar";

const EditPost = () => {
  const { id } = useParams("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateImage, setUpdateImage] = useState(null);
  const [updateContent, setUpdateContent] = useState("");
  const navigate = useNavigate();

  // Lấy dữ liệu từ server
  const fetchPostData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/auth/posts/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post data");
      }
      const data = await response.json();
      setUpdateTitle(data.post.title);
      setUpdateContent(data.post.content);
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  };
  // Gọi hàm fetchPostData khi component được mount
  useEffect(() => {
    fetchPostData();
  }, [id]);

  // Xử lý updatePost
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", updateTitle);
    formData.append("image", updateImage);
    formData.append("content", updateContent);
    // Kiểm tra dữ liệu
    if (!updateTitle || !updateImage || !updateContent) {
      alert("Please fill in all fields.");
      return;
    }
    // Gửi dữ liệu đến server
    try {
      const response = await fetch(`http://localhost:8080/auth/posts/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert("Post updated successfully!");
        // Reset form fields
        setUpdateTitle("");
        setUpdateImage("");
        setUpdateContent("");
      } else {
        alert("Error updating post: " + data.message);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  // Xử lý nút Cancel
  const handleCancel = () => {
    navigate("/");
  };
  return (
    <div>
      <NavBar />
      <div className="flex flex-col gap-4 items-center justify-center w-full h-full p-20 ">
        <div className="border justify-center items-center bg-gray-100 w-150 rounded-lg shadow-lg">
          <p className="text-2xl font-bold border-b px-4 py-4 text-purple-800">
            Update Posts
          </p>
          <div className="flex justify-center mt-5 ">
            <div className="flex flex-col">
              <div className="flex flex-col px-4">
                <label className="text-xl">TITLE</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="border p-2 mb-2 w-140"
                />
              </div>
              <div className="flex flex-col px-4">
                <label className="text-xl">IMAGE</label>
                <input
                  type="file"
                  placeholder="Image URL"
                  onChange={(e) => setUpdateImage(e.target.files[0])}
                  className="border p-2 mb-2 w-140"
                />
                <p>Please choose an image</p>
              </div>

              <div className="flex flex-col px-4">
                <label className="text-xl">CONTENT</label>
                <textarea
                  placeholder="Content"
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
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
                  onClick={handleUpdatePost}
                >
                  UPDATE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
