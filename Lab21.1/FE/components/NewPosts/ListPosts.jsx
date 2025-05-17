import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  // const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // thiết lập ngày post
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetch("http://localhost:8080/auth/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data.posts);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  const handleDelete = (postId) => {
    fetch(`http://localhost:8080/auth/posts/${postId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete post");
        }
        return response.json();
      })
      .then(() => {
        setPosts(posts.filter((post) => post._id !== postId));
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };
  return (
    <div className="post-list container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Posts</h2>
      {posts.length > 0 ? (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post._id}
              className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition-shadow"
            >
              <p>Posted by on {formatDate(post.createdAt)}</p>
              <h3 className="text-3xl font-semibold text-gray-800">
                {post.title}
              </h3>
              <p className="text-gray-600 mt-2">{post.content}</p>
              <div className="mt-4 flex space-x-2 justify-end">
                <button
                  onClick={() => navigate(`/post/${post._id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/edit/${post._id}`)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default PostList;
