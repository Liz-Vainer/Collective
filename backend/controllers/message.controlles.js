export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id } = req.params;
    const senderId = req.userId;
  } catch (err) {
    console.log("Error in sendMessage controllers", err.message);
    res.status(500).json({ err: "Internal server error" });
  }
};
