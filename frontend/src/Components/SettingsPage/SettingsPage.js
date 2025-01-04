import React, { useState } from "react";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  console.log("USER: ", user);
  // Define the state variables locally in SettingsPage
  const [gender, setGender] = useState(user.gender);
  const [age, setAge] = useState(user.age);
  console.log("THIS IS USER.AGE ", user.age);
  const [isReligious, setIsReligious] = useState(user.isReligious);
  const [religion, setReligion] = useState(user.religion);
  const [ethnicity, setEthnicity] = useState(user.ethnicity);
  const [interest, setInterest] = useState(user.interest);

  // Handle form submission (save to MongoDB here)
  const handleSubmit = async () => {
    const userData = {
      userID: user.id,
      gender,
      age,
      isReligious,
      religion,
      ethnicity,
      interest,
    };

    // Send the data to the backend (MongoDB)
    await fetch("/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    navigate("/home");
  };

  return (
    <div className="container">
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
        <label htmlFor="interest-select">
          What is your preferred interest?
        </label>
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

export default SettingsPage;
