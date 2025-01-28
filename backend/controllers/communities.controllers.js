import Community from "../models/community.js"; // Community model

const maxRadiusKm = 10; // 10 km
const EARTH_RADIUS_KM = 6371;
const BEER_SHEVA_COORDS = { lat: 31.2546, lng: 34.7891 };

function haversineDistance(lat1, lng1, lat2, lng2) {
  // convert degrees to radians
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  // calculate the difference in latitude and longitude in radians
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  // convert both latitudes to radians
  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  // haversine formula to calculate the square of half the chord length between points
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLng / 2) ** 2;

  // calculate the angular distance in radians
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // multiply by earth's radius in km to get the distance
  return EARTH_RADIUS_KM * c;
}

// check if the community is within the radius
function isWithinRadius(lat, lng, radiusKm) {
  const distance = haversineDistance(
    BEER_SHEVA_COORDS.lat,
    BEER_SHEVA_COORDS.lng,
    lat,
    lng
  );
  return distance <= radiusKm; // return true if the distance is within the radius
}

// add a new community
export const add_community = async (req, res) => {
  const { name, category } = req.body;
  const lat = parseFloat(req.body.lat); // ensure lat is a number
  const lng = parseFloat(req.body.lng); // ensure lng is a number

  try {
    // check if the community already exists by name
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({ message: "community already exists" });
    }

    // check if the community is within the allowed radius from be'er sheva
    if (!isWithinRadius(lat, lng, maxRadiusKm)) {
      console.log("the new community is too far from be'er sheva.");
      return res
        .status(400)
        .json({ message: "the new community is too far from be'er sheva." });
    }

    // check if another community exists with the same coordinates
    const sameCord = await Community.findOne({ lng, lat });
    if (sameCord) {
      return res
        .status(400)
        .json({ message: "community with the same cords already exists" });
    }

    // create a new community
    const newCommunity = new Community({
      name,
      category,
      lng,
      lat,
    });

    await newCommunity.save(); // save the new community to the database

    res.status(201).json(newCommunity); // respond with the created community
  } catch (err) {
    console.error("error creating community:", err);
    res.status(500).json({ message: "internal server error" });
  }
};

// remove a community by name
export const rem_community = async (req, res) => {
  const { name } = req.body;

  try {
    const result = await Community.deleteOne({ name }); // delete the community by name
    if (result.deletedCount === 0) {
      // check if no community was deleted
      return res
        .status(404)
        .json({ message: `community '${name}' not found.` });
    }
    res
      .status(200)
      .json({ message: `community '${name}' deleted successfully!` });
  } catch (err) {
    console.error("error deleting community:", err);
    res.status(500).json({ message: "internal server error" });
  }
};

// fetch all communities
export const fetch_communities = async (req, res) => {
  try {
    const communities = await Community.find(); // fetch all communities from the database
    res.json({ communities }); // send the communities as the response
  } catch (err) {
    console.error("error fetching communities:", err);
    res.status(500).json({ message: "failed to fetch communities." });
  }
};
