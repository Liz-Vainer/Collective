const mongoose = require("mongoose");
const communitySchema = require("./models/community");

const communityDbConnection = mongoose.createConnection(
  "mongodb://127.0.0.1:27017/CommunitiesDb"
);

const Community = communityDbConnection.model("Community", communitySchema);

const fakeCommunities = [
  {
    name: "Art Lovers",
    lat: 31.2561,
    lng: 34.7946,
    category: "Entertainment",
  },
  {
    name: "Tech Enthusiasts",
    lat: 31.2543,
    lng: 34.7921,
    category: "Entertainment",
  },
  {
    name: "Running club",
    lat: 31.2508,
    lng: 34.7905,
    category: "Sport",
  },
  {
    name: "Local church",
    lat: 31.2535,
    lng: 34.789,
    category: "Religion",
  },
  {
    name: "Swimming pool",
    lat: 31.2575, // Adjusted lat to avoid duplicate
    lng: 34.793, // Adjusted lng to avoid duplicate
    category: "Sport",
  },
];

// Wrap your logic in an async function
(async () => {
  try {
    // Clear the existing data to avoid duplicate errors
    await Community.deleteMany({}); // Clears existing data

    for (let i = 0; i < fakeCommunities.length; i++) {
      try {
        // Save each community ensuring no duplicates
        const community = new Community(fakeCommunities[i]);
        await community.save();
      } catch (err) {
        // Log the community name and error if there's a duplicate
        console.error(`Failed to insert community: ${fakeCommunities[i].name}`);
        console.error("Error:", err.message);
      }
    }

    console.log("Inserted fake communities successfully.");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    communityDbConnection.close(); // Ensure connection is closed
    console.log("Database connection closed.");
  }
})();
