import React from "react";
import Member from "./Member";
import useGetMembers from "../../hooks/useGetMembers";
import useMembers from "../../zustand/useMembers";

const Members = ({ selectedCommunity }) => {
  useGetMembers(selectedCommunity._id);
  const { members } = useMembers(); // Directly subscribe to global state
  if (members)
    return (
      <div className="members-container">
        {members.map((user) => (
          <Member
            key={user.id}
            user={user}
            communityId={selectedCommunity._id}
          />
        ))}
      </div>
    );
  else {
    return <div>There are no members!</div>;
  }
};

export default Members;
