import { useEffect, useState} from "react";
import { useParams, useNavigate} from "react-router-dom";
import axios from "axios";

import likeSvg from "../assets/images/like.svg";
import commentSvg from "../assets/images/comment.svg";
import shareSvg from "../assets/images/share.svg";

function ProfileComments() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/comments/user/${id}`)
      .then(res => setComments(res.data))
      .catch(() => setComments([]));
  }, [id]);

  function goToPost(postId) {
    navigate(`/post/${postId}`);
  }

  return (
    <div className="commentsListBox flex-column">
        <div className="commentsList flex-column">
            {comments.length > 0 ? comments.map(comment => (
                <div className="commentCard flex-column" key={comment.id}>
                    <div className="headInfoBox">
                           {comment.userId ? (
                                comment.userId.image && comment.userId.image.trim() !== "" ? (
                                <img
                                    className="userAvatar"
                                    src={`http://localhost:5000${comment.userId.image}`}
                                    alt="avatar"
                                />
                                ) : (
                                <div className="userAvatar flex-center">
                                    <p>{comment.userId.username.charAt(0)}</p>
                                </div>
                                )
                            ) : (
                                <div className="userAvatar flex-center">
                                <p>?</p>
                                </div>
                            )}
                            <p className="userName">{comment.userId?.username || "Unknown"}</p> 
                            <div className="circle"></div>
                        <a href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                goToPost(comment.postId._id);
                            }}
                            >{comment.postId.title}</a>
                    </div>
                    <p className="commentTitle">{comment.text}</p>
                    <div className="buttonsBox">
                        <div className="likesBox flex-center">
                            <img src={likeSvg} alt="" />
                            <p>{comment.postId.likes}</p>
                        </div>
                        <div className="commentsBox flex-center">
                            <img src={commentSvg} alt="" />
                            <p>{comment.postId.comments}</p>
                        </div>
                        <button className="shareButton">
                            <img src={shareSvg} alt="" />
                            Share
                        </button>
                    </div>
                </div>
            )) : <p className="noCommentsMessage">Пользователь не оставлял комментариев</p>}
        </div>
    </div>
  );
}

export default ProfileComments;
