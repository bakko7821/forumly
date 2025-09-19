import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import Navbar from "./components/Navbar.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Home from "./pages/Home.jsx";
import Post from "./pages/Post.jsx";
import ProfilePosts from "./pages/ProfilePosts.jsx";
import ProfileComments from "./pages/ProfileComments.jsx";

import "./styles/App.css";

function App() {
  return (
    <div className="contentBox flex-center flex-column">
      <Navbar />

      <div className="mainContainer">
        <Routes>
          <Route path="/post/:id" element={<Post />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* вложенные маршруты профиля */}
          <Route path="/profile/:id" element={<Profile />}>
            <Route path="posts" element={<ProfilePosts />} />
            <Route path="comments" element={<ProfileComments />} />
          </Route>

          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
