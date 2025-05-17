import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-auto rounded-lg"
      />

      <p className="text-gray-600">Created by on {formatDate(post.createAt)}</p>
      <p className="text-gray-600">{post.content}</p>
    </div>
  );
};
export default ViewPosts;
