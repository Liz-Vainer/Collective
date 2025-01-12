import React from "react";
import "./Friends.css";
import Request from "./Request";
import useGetRequests from "../../hooks/useGetRequests";
import useListenRequests from "../../hooks/useListenRequests";

const Friends = () => {
  const { requests, loading } = useGetRequests();
  useListenRequests();

  // Render loading spinner or message while data is loading
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or a more styled message
  }

  // Ensure friends is always an array before calling map()
  const requestsArray = Array.isArray(requests) ? requests : [];

  return (
    <div className="convs">
      {requestsArray.map((user) => (
        <Request key={user._id} user={user} />
      ))}
    </div>
  );
};

export default Friends;
