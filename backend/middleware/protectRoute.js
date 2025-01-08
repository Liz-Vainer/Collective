import jwt from "jsonwebtoken"; // Import the JSON Web Token library for token handling
import User from "../models/user.js"; // Import the User model to interact with the database
import Orginaizer from "../models/orginaizer.js"; // Import the User model to interact with the database
import Official from "../models/official.js"; // Import the User model to interact with the database

// Middleware function to protect routes by verifying user authentication
const protectRoute = async (req, res, next) => {
  try {
    // Retrieve the JWT from cookies
    const token = req.cookies.jwt;
    if (!token) {
      // If no token is found, send a 401 Unauthorized response
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(
      token,
      "/8/daecwqK21qn/lUPuU09HrnnS2qf9eroVuiVQbd54=" // Secret key used to sign the token
    );

    if (!decoded) {
      // If token verification fails, send a 401 Unauthorized response
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    // Find the user in the database using the ID from the decoded token
    // Exclude the password field from the retrieved user data for security
    let user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      // Check Organizer model if not found in User model
      user = await Orginaizer.findById(decoded.userId).select("-password");
      if (!user)
        // Check Official model if not found in Organizer model
        user = await Official.findById(decoded.userId).select("-password");
    }

    console.log(user);
    if (!user) {
      // If the user is not found, send a 404 Not Found response
      return res.status(404).json({ error: "User not found" });
    }

    // Attach the authenticated user to the `req` object for downstream handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle errors that may occur during the process
    console.log("Error in protected middleware: ", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};

export default protectRoute; // Export the middleware function for use in other parts of the application
