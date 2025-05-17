import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../NavBar/NavBar";

const ViewPosts = () => {
  const [post, setPost] = useState(null);

  // lấy id từ đường dẫn bằng useParams
  const { id } = useParams();

  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetch(`http://localhost:8080/auth/posts/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        return response.json();
      })
      .then((data) => {
        setPost(data.post);
        console.log("post khác mà", data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);
  if (!post) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <NavBar />
      <div className="flex flex-col gap-4 items-center justify-center w-full h-full p-20">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="text-gray-600 ">
          Created by on {formatDate(post.createdAt)}
        </p>
        <div className="flex w-190 border-t justify-center items-center ">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-150 h-100 object-cover rounded-lg mb-4 "
          />
        </div>

        <p className="text-gray-600">{post.content}</p>
        <button
          onClick={() => {
            navigate("/");
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 w-fit cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </>
  );
};
export default ViewPosts;
