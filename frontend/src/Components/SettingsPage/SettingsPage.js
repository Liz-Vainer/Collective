import React, { useEffect } from "react";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  const loggedUser = useUser();

  useEffect(() => {
    if (!loggedUser.isReligious) {
      loggedUser.setReligion("no");
    } else if (loggedUser.religion === "no") {
      loggedUser.setReligion("muslim");
    }
  }, [loggedUser.isReligious, loggedUser.religion]);

  // Handle form submission (save to MongoDB here)
  const handleSubmit = async () => {
    console.log(loggedUser.religion);
    try {
      const userData = {
        userID: loggedUser.user?.id,
        gender: loggedUser.gender,
        age: loggedUser.age,
        isReligious: loggedUser.isReligious,
        religion: loggedUser.religion,
        ethnicity: loggedUser.ethnicity,
        interest: loggedUser.interest,
      };

      // Send the data to the backend (MongoDB)
      const response = await fetch("/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        // If the response status is not in the range 200–299, throw an error
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update settings.");
      }

      const resData = await response.json();
      console.log("Settings updated successfully:", resData);
    } catch (error) {
      console.error("Error while updating user settings:", error.message);
      alert(`Error: ${error.message}`); // Display an error message to the user
    }
    // Navigate to home on success
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
          value={loggedUser.gender}
          onChange={(e) => loggedUser.setGender(e.target.value)}
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
          value={loggedUser.age}
          onChange={(e) => loggedUser.setAge(e.target.value)}
        />
      </div>

      {/* Religious Question */}
      <div className="question">
        <label>Are you religious?</label>
        <input
          type="checkbox"
          checked={loggedUser.isReligious}
          onChange={(e) => loggedUser.setIsReligious(e.target.checked)}
        />
        {loggedUser.isReligious && (
          <select
            className="religion-list"
            value={loggedUser.religion}
            onChange={(e) => loggedUser.setReligion(e.target.value)}
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
          value={loggedUser.ethnicity}
          onChange={(e) => loggedUser.setEthnicity(e.target.value)}
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
          value={loggedUser.interest}
          onChange={(e) => loggedUser.setInterest(e.target.value)}
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
