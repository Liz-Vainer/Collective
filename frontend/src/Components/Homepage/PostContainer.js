import React, { useState } from 'react';
import './PostContainer.css';
import CommunityPost1 from '../Assets/communityPost_1.jpg';
import CommunityPost2 from '../Assets/communityPost_2.jpg';
import CommunityPost3 from '../Assets/communityPost_3.jpg';

const Post = ({ image, id, onLike, onDislike, likeCount, dislikeCount }) => {
  return (
    <div className="post">
      <img src={image} alt={`Post ${id}`} className="post-image" />
      <div className="post-actions">
        <button className="like-button" onClick={() => onLike(id)}>👍 {likeCount}</button>
        <button className="dislike-button" onClick={() => onDislike(id)}>👎 {dislikeCount}</button>
      </div>
    </div>
  );
};

const PostContainer = () => {
  const [likes, setLikes] = useState([1, 1, 1]); // Start with one like for each post
  const [dislikes, setDislikes] = useState([0, 0, 0]); // Start with zero dislikes for each post
  const [isPaused, setIsPaused] = useState(false);

  // Image URLs for the posts (you can replace these with your own images)
  const postImages = [
    CommunityPost1,
    CommunityPost2,
    CommunityPost3,
  ];

  // Handle like click
  const handleLike = (id) => {
    const updatedLikes = [...likes];
    updatedLikes[id] += 1;
    setLikes(updatedLikes);
  };

  // Handle dislike click
  const handleDislike = (id) => {
    const updatedDislikes = [...dislikes];
    updatedDislikes[id] += 1;
    setDislikes(updatedDislikes);
  };

  // Handle hover events
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div
      className="post-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`post-wrapper ${isPaused ? 'paused' : ''}`}>
        {postImages.map((image, index) => (
          <Post
            key={index}
            id={index}
            image={image}
            onLike={handleLike}
            onDislike={handleDislike}
            likeCount={likes[index]}
            dislikeCount={dislikes[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default PostContainer;
