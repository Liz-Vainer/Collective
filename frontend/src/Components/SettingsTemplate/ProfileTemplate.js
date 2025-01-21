import React, { useEffect, useState } from "react";
import "./ProfileTemplate.css";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const ProfileTemplate = () => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useUser();

  const [isEditing, setIsEditing] = useState({
    gender: false,
    age: false,
    religion: false,
    ethnicity: false,
    interest: false,
  });

  const [gender, setGender] = useState(authUser.gender);
  const [age, setAge] = useState(authUser.age);
  const [religion, setReligion] = useState(authUser.religioun);
  const [ethnicity, setEthnicity] = useState(authUser.ethnicity);
  const [interest, setInterest] = useState(authUser.interest);

  const [isReligious, setIsReligious] = useState(false);

  useEffect(() => {
    if (authUser.religioun === "no") {
      setIsReligious(false);
    } else {
      setIsReligious(true);
    }
  }, [authUser.religioun]);

  const toggleEdit = (section) => {
    setIsEditing((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSave = async () => {
    const userData = {
      userID: authUser.id,
      gender: gender,
      age: age,
      religion: religion,
      ethnicity: ethnicity,
      interest: interest,
      userType: authUser.userType,
    };

    try {
      const response = await fetch("/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update settings.");
      }
      const resData = await response.json();
      setAuthUser(resData);
      localStorage.setItem("user-info", JSON.stringify(resData));
      navigate("/home");
    } catch (error) {
      console.error("Error while updating user settings:", error.message);
    }
  };

  return (
    <div>
       <div className="profile-header">
    <h2>Profile</h2>
    <button className="back-home-button" onClick={handleSave}>Back home</button>
  </div>
      <ul>
        <li>
          <strong>Name:</strong> {authUser.name}
        </li>
        <hr />
        <li>
          <strong>Gender:</strong>
          {isEditing.gender ? (
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <span>{gender}</span>
          )}
          <button onClick={() => toggleEdit("gender")}>
            {isEditing.gender ? "Save" : "Edit"}
          </button>
        </li>
        <hr />
        <li>
          <strong>Age:</strong>
          {isEditing.age ? (
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="18"
              max="100"
            />
          ) : (
            <span>{age}</span>
          )}
          <button onClick={() => toggleEdit("age")}>
            {isEditing.age ? "Save" : "Edit"}
          </button>
        </li>
        <hr />
        <li>
          <strong>Religion:</strong>
          {isEditing.religion ? (
            <div>
              <input
                type="text"
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
              />
              <button onClick={() => toggleEdit("religion")}>Save</button>
            </div>
          ) : (
            <span>{religion}</span>
          )}
          <button onClick={() => toggleEdit("religion")}>
            {isEditing.religion ? "Save" : "Edit"}
          </button>
        </li>
        <hr />
        <li>
          <strong>Ethnicity:</strong>
          {isEditing.ethnicity ? (
            <select
              value={ethnicity}
              onChange={(e) => setEthnicity(e.target.value)}
            >
              <option value="caucasian">Caucasian</option>
              <option value="black">Black</option>
              <option value="middle-eastern">Middle Eastern</option>
              <option value="asian">Asian</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <span>{ethnicity}</span>
          )}
          <button onClick={() => toggleEdit("ethnicity")}>
            {isEditing.ethnicity ? "Save" : "Edit"}
          </button>
        </li>
        <hr />
        <li>
          <strong>Interest:</strong>
          {isEditing.interest ? (
            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            >
              <option value="entertainment">Entertainment</option>
              <option value="sport">Sport</option>
              <option value="religion">Religion</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <span>{interest}</span>
          )}
          <button onClick={() => toggleEdit("interest")}>
            {isEditing.interest ? "Save" : "Edit"}
          </button>
        </li>
      </ul>
      

    </div>
  );
};

export default ProfileTemplate;
