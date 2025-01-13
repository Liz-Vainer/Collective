import React from "react";
import useGetUsers from "../../hooks/useGetUsers";
import Friend from "./Friend";
import "./Friends.css";

const Friends = () => {
  const { users } = useGetUsers();
  return (
    <div className="convs">
      {users.map((user) => (
        <Friend key={user._id} user={user} />
      ))}
    </div>
  );
};

export default Friends;
