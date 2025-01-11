import React from "react";
import "./Friends.css";
import Request from "./Request";
import useGetRequests from "../../hooks/useGetRequests";

const Friends = () => {
  const { requests } = useGetRequests();
  return (
    <div className="convs">
      {requests.map((user) => (
        <Request key={user._id} user={user} />
      ))}
    </div>
  );
};

export default Friends;
