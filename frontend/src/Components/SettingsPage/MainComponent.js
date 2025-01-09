import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const MainComponent = () => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useUser();
  const [isReligious, setIsReligious] = useState(false); // Track if user is religious
  const [religion, setReligion] = useState(authUser.religioun); // Track selected religion

  useEffect(() => {
    if (authUser.religioun === "no") {
      setIsReligious(false);
    } else if (authUser.religioun !== "no") {
      setIsReligious(true);
    }
  }, [authUser.religioun]);

  useEffect(() => {
    if (!isReligious) {
      setReligion("no");
    } else if (authUser.religioun !== "no") {
      setReligion(authUser.religioun);
    } else {
      setReligion("muslim");
    }
  }, [isReligious, authUser.religioun]);

  const [gender, setGender] = useState(authUser.gender);
  const [age, setAge] = useState(authUser.age);
  const [ethnicity, setEthnicity] = useState(authUser.ethnicity);
  const [interest, setInterest] = useState(authUser.interest);

  const handleSubmit = async () => {
    try {
      const userData = {
        userID: authUser.id,
        gender: gender,
        age: age,
        religion: religion,
        ethnicity: ethnicity,
        interest: interest,
        userType: authUser.userType,
      };

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
      console.log("Settings updated successfully:", resData);
      setAuthUser(resData);
      localStorage.setItem("user-info", JSON.stringify(resData));
    } catch (error) {
      console.error("Error while updating user settings:", error.message);
    }
    navigate("/home");
  };

  return (
    <div className="main-container">
      <h2>Can you tell us more about you?</h2>
      <h3>(Optional)</h3>
      {/* Gender Question */}
      <div className="question">
        <label htmlFor="gender-select">What is your gender?</label>
        <select
          id="gender-select"
          className="gender-list"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      {/* Age Question */}
      <div className="question">
        <label htmlFor="age-input">What is your age?</label>
        <input
          type="number"
          id="age-input"
          className="age-input"
          placeholder="age"
          min="18"
          max="100"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      {/* Religious Question */}
      <div className="question">
        <label>Are you religious?</label>
        <input
          type="checkbox"
          checked={isReligious}
          onChange={(e) => setIsReligious(e.target.checked)}
        />
        {isReligious && (
          <select
            className="religion-list"
            value={religion}
            onChange={(e) => setReligion(e.target.value)}
          >
            <option value="muslim">Muslim</option>
            <option value="jewish">Jewish</option>
            <option value="christian">Christian</option>
            <option value="other">Other</option>
          </select>
        )}
      </div>
      {/* Ethnicity Question */}
      <div className="question">
        <label htmlFor="ethnicity-select">What is your ethnicity?</label>
        <select
          id="ethnicity-select"
          className="religion-list"
          value={ethnicity}
          onChange={(e) => setEthnicity(e.target.value)}
        >
          <option value="caucasian">Caucasian</option>
          <option value="black">Black</option>
          <option value="middle-eastern">Middle Eastern</option>
          <option value="asian">Asian</option>
          <option value="other">Other</option>
        </select>
      </div>
      {/* Interest Question */}
      <div className="question">
        <label htmlFor="interest-select">What is your preferred interest?</label>
        <select
          id="interest-select"
          className="religion-list"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        >
          <option value="entertainment">Entertainment</option>
          <option value="sport">Sport</option>
          <option value="religion">Religion</option>
          <option value="other">Other</option>
        </select>
      </div>
      {/* Submit Button */}
      <div className="submit-container">
        <button onClick={handleSubmit}>Save Changes</button>
      </div>
    </div>
  );
};

export default MainComponent;
