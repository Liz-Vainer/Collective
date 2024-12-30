import Community from "../models/community.js"; // Community model

const maxRadiusKm = 10; // 10 km
const EARTH_RADIUS_KM = 6371;
const BEER_SHEVA_COORDS = { lat: 31.2546, lng: 34.7891 };

function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}
// Check if the community is within the radius
function isWithinRadius(lat, lng, radiusKm) {
  const distance = haversineDistance(
    BEER_SHEVA_COORDS.lat,
    BEER_SHEVA_COORDS.lng,
    lat,
    lng
  );
  return distance <= radiusKm;
}

//add community
export const add_community = async (req, res) => {
  const { name, category } = req.body;
  const lat = parseFloat(req.body.lat); // Ensure lat is a number
  const lng = parseFloat(req.body.lng); // Ensure lng is a number

  try {
    // Check if the community already exists
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({ message: "Community already exists" });
    }
    //Checking with the radius
    if (!isWithinRadius(lat, lng, maxRadiusKm)) {
      console.log("The new community is too far from Be'er Sheva.");
      return res
        .status(400)
        .json({ message: "The new community is too far from Be'er Sheva." });
    }
    const sameCord = await Community.findOne({ lng, lat });
    if (sameCord) {
      return res
        .status(400)
        .json({ message: "Community with the same cords already exists" });
    }
    // Create a new community
    const newCommunity = new Community({
      name,
      category,
      lng,
      lat,
    });

    await newCommunity.save(); // Save the new community to the database

    res.status(201).json(newCommunity);
  } catch (err) {
    console.error("Error creating community:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//remove community
export const rem_community = async (req, res) => {
  const { name } = req.body;

  try {
    const result = await Community.deleteOne({ name }); // Specify the query object
    if (result === 0) {
      return res
        .status(404)
        .json({ message: `Community '${name}' not found.` });
    }
    res
      .status(200)
      .json({ message: `Community '${name}' deleted successfully!` });
  } catch (err) {
    console.error("Error deleting community:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//fetch communities
export const fetch_communities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.json({ communities });
  } catch (err) {
    console.error("Error fetching communities:", err);
    res.status(500).json({ message: "Failed to fetch communities." });
  }
};
