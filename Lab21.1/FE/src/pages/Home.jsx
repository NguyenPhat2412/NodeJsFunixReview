import { useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import NewPosts from "../../components/NewPosts/NewPosts";
import ListPosts from "../../components/NewPosts/ListPosts";

const Home = () => {
  const [showForm, setShowForm] = useState(false);

  const handleNewPost = () => {
    setShowForm(true);
  };

  return (
    <>
      <NavBar />
      <div className="home">
        <h1 className="text-4xl font-bold text-center mt-10">
          Welcome to MessageNode
        </h1>
        <p className="text-center mt-4">
          Your one-stop solution for all messaging needs.
        </p>
        <div className="flex justify-center mt-10 ">
          <div>
            <input className="border" />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2">
              UPDATE
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-yellow-700 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            onClick={handleNewPost}
          >
            NEW POSTS
          </button>
        </div>
        {showForm && (
          <div className="flex position: absolute top-16 left-0 right-0 bottom-0 justify-center items-center bg-gray-500">
            <NewPosts showForm={showForm} setShowForm={setShowForm} />
          </div>
        )}
      </div>
      <div className="flex justify-center mt-10">
        <ListPosts />
      </div>
    </>
  );
};

export default Home;
