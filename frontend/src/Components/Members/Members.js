import React from "react";
import Member from "./Member";
import useGetMembers from "../../hooks/useGetMembers";

const Members = ({ selectedCommunity }) => {
  const { members } = useGetMembers(selectedCommunity._id);
  console.log(members);

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
