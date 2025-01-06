import Community from "../models/community.js"; // Community model

//add community
export const add_community = async (req, res) => {
  const { name, category, lng, lat } = req.body;

  try {
    // Check if the community already exists
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({ message: "Community already exists" });
    }

    const sameCord = await Community.findOne({ lng, lat });
    if (sameCord) {
      console.log("BAS");
      return res
        .status(400)
        .json({ message: "Community with the same cors already exists" });
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
