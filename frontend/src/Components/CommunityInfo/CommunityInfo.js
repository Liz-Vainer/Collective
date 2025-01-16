import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CommunityInfo.css";
import CommunityTemplate from "../ComTemplate/communityTemplate"; // Corrected import path

const CommunityInfo = () => {
    const [communityData, setCommunityData] = useState(null);
    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {
        fetch("/api/community")
            .then((response) => response.json())
            .then((data) => {
                if (isMounted.current) {
                    setCommunityData(data);
                }
            })
            .catch((error) => {
                console.error("Error fetching community data:", error);
            });

        return () => {
            isMounted.current = false;
        };
    }, []);

    if (!communityData) {
        return <div>Loading...</div>;
    }

    // Assuming communityData is an array of communities
    return (
        <div className="community-info">
            {communityData.map((community) => (
                <CommunityTemplate
                    key={community.id}
                    name={community.name}
                    mainContent={community.mainContent}
                />
            ))}
        </div>
    );
};

export default CommunityInfo;
