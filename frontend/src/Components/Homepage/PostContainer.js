import React, { useEffect, useState } from "react";
import "./PostContainer.css";
import useGetEvents from "../../hooks/useGetEvents";
import { useUser } from "../../context/UserContext";
import Popup from "../Popup/Popup";
import useCreateEvent from "../../hooks/useCreateEvent";
import useRemoveEvent from "../../hooks/useRemoveEvent";
import useEvents from "../../zustand/useEvents";
import useIsParticipant from "../../hooks/useIsParticipant";
import useJoinEvent from "../../hooks/useJoinEvent";

// Function to convert image URL to base64
const convertImageToBase64 = async (imageUrl) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob); // This converts the blob into base64
  });
};

const Post = ({ event }) => {
  const { authUser } = useUser();
  const { removeEvent, loading } = useRemoveEvent();
  const [isParticipant, setIsParticipant] = useState(null);
  const { joinEvent } = useJoinEvent();
  const { isParticipant: checkParticipant } = useIsParticipant(); // Destructure isParticipant from useIsParticipant

  useEffect(() => {
    // Check if the user is a participant when the component mounts
    const fetchParticipantStatus = async () => {
      const status = await checkParticipant(event._id, authUser.id);
      setIsParticipant(status);
    };

    fetchParticipantStatus();
  }, [authUser.id, event._id, checkParticipant]);

  const handleRemove = async () => {
    await removeEvent(event.name);
  };

  const handleParticipants = async () => {};

  const handleJoinOrLeave = async () => {
    if (!isParticipant) {
      // If not a participant, join the event
      const success = await joinEvent(event._id, authUser.id);
      if (success) {
        setIsParticipant(true);
      }
    } else {
    }
  };
  // Handle like click
  const handleLike = () => {};

  // Handle dislike click
  const handleDislike = () => {};

  return (
    <div className="post">
      <p className="name">{event.name}</p>

      <img src={event.image} alt={`Post ${event.id}`} className="post-image" />
      <div className="post-actions">
        <button className="like-button" onClick={() => handleLike()}>
          👍 {event.likes}
        </button>
        <button className="dislike-button" onClick={() => handleDislike()}>
          👎 {event.dislikes}
        </button>
        {authUser.userType === "Organizer" && (
          <div>
            <button
              onClick={() => handleRemove()}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Removing..." : "Remove"}{" "}
              {/* Display different text during loading */}
            </button>
            <button onClick={() => handleParticipants()}>participants</button>
          </div>
        )}
        {authUser.userType === "User" && (
          <div>
            <button
              onClick={() => handleJoinOrLeave()}
              disabled={loading} // Disable button while loading
            >
              {isParticipant ? "Leave" : "Join"}{" "}
              {/* Display different text during loading */}
            </button>
          </div>
        )}
      </div>
      <p className="date">
        {event.start} - {event.end}
      </p>
    </div>
  );
};

const PostContainer = () => {
  const { authUser } = useUser();
  const { events, setEvents } = useEvents();
  useGetEvents();
  const [isPaused, setIsPaused] = useState(false);
  const [addButton, setAddButton] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    community: "",
    startDate: "",
    endDate: "",
    image: "",
  });
  const { createEvent, loading } = useCreateEvent();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const toggleAdd = () => {
    setAddButton(!addButton);
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const HandleAddEvent = async (e) => {
    e.preventDefault();

    // Convert image URL to base64
    let base64Image = newEvent.image;
    if (newEvent.image) {
      base64Image = await convertImageToBase64(newEvent.image); // Convert URL to base64
    }
    newEvent.image = base64Image;

    const createdEvent = await createEvent(newEvent);
    if (createdEvent) {
      setEvents([...events, createdEvent]);
      setAddButton(false); // Close the popup after the event is created
    }
  };

  if (!events) {
    return <div>Loading events...</div>;
  }

  // Ensure events is always an array
  if (!Array.isArray(events)) {
    console.log(events);
    return <div>Loading events...</div>;
  }

  return (
    <>
      {authUser.userType === "Organizer" && (
        <div>
          <button onClick={toggleAdd}>Add event</button>
        </div>
      )}
      <div
        className="post-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`post-wrapper ${isPaused ? "paused" : ""}`}>
          {events.map((event) => (
            <Post key={event._id} event={event} />
          ))}
        </div>
      </div>
      <Popup trigger={addButton} setTrigger={toggleAdd} className="popup">
        <form onSubmit={HandleAddEvent} className="create-event-form">
          <h2>Create New Event</h2>
          <label htmlFor="name">Event Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newEvent.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="community">Community:</label>
          <input
            type="text"
            id="community"
            name="community"
            value={newEvent.community}
            onChange={handleChange}
            required
          />
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={newEvent.startDate}
            onChange={handleChange}
            required
          />
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={newEvent.endDate}
            onChange={handleChange}
            required
          />
          <label htmlFor="image">Event Image URL:</label>
          <input
            type="url"
            id="image"
            name="image"
            value={newEvent.image}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </Popup>
    </>
  );
};

export default PostContainer;
