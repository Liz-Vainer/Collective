import { useState, useEffect } from "react";
import useFriends from "../zustand/useFriends";

const useGetConversation = () => {
  const { friends, setFriends } = useFriends();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/friends");
        const data = await res.json();
        if (!data) {
          throw new Error(data.error);
        }
        console.log("friends:", data);
        setFriends(data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        alert("An error occurred. Please try again.");
      }
    };
    getConversations();
  }, [friends]);
  return { friends };
};

export default useGetConversation;
