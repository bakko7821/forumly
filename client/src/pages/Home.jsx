import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";

import likeSvg from "../assets/images/like.svg";
import commentSvg from "../assets/images/comment.svg";
import starSvg from "../assets/images/star.svg";
import shareSvg from "../assets/images/share.svg";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке постов:", err);
      }
    };
    fetchPosts();
  }, []);

  const [authors, setAuthors] = useState([])
  useEffect(() => {
    axios.get("http://localhost:5000/users/popular")
      .then(res => setAuthors(res.data))
      .catch(err => console.error("Ошибка при загрузке авторов:", err));
  }, []);

  const navigate = useNavigate();

  function goToPost(postId) {
    navigate(`/post/${postId}`);
  }

  return (
    <div className="homePage flex-ceneter flex-column">
      <div className="cardBoxPosts flex-center">

      </div>
      <div className="infoBox">
        <div className="postsList flex-column">
          {posts.map((post) => (
            <div key={post._id} className="postCard flex-column">
              <div className="postHeadingInfo flex-between">
                <div className="userInfo flex-center">
                  <div className="userAvatar"></div>
                  <p className="userName">{post.author?.username || "Неизвестно"}</p>
                  <div className="circle"></div>
                  <p className="postTime">3 часа назад</p>
                </div>
                <button className="goToPostButton" onClick={() => goToPost(post._id)}>Вступить</button>
              </div>
              <p className="postHeadingText">{post.title}</p>
              {/* <p>{post.text}</p> */}
              <div className="postInfo">
                <div className="likesBox flex-center">
                  <img src={likeSvg} alt="" />
                  <p>{post.likes}</p>
                </div>
                <div className="commentsBox flex-center">
                  <img src={commentSvg} alt="" />
                  <p>{post.comments}</p>
                </div>
                <button className="starButton">
                  <img src={starSvg} alt="" />
                </button>
                <button className="shareButton">
                  <img src={shareSvg} alt="" />
                  Поделиться
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="usersBox flex-center flex-column">
          <p>Популярные пользователи</p>
          <div className="usersList flex-column">
            {authors.map(user => (
              <div className="userCard" key={user._id}>
                <div className="userAvatar"></div>
                <div className="userInfo flex-column">
                  <p className="userName">{user.username}</p>
                  <p className="userFollowersCount">{user.followersCount} подписчиков</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
