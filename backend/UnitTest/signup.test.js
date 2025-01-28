import * as chai from "chai";
import chaiHttp from "chai-http";
import jwt from "jsonwebtoken";
import app from "../index.js"; 
import User from "../models/user.js";
import mongoose from "mongoose";
import { signup } from "../controllers/user.controllers.js";


chai.use(chaiHttp);
const { expect } = chai;

describe("POST /signup", function () {
  it('should return 400 for invalid credentials', async () => {
    const newUser = {
        name: " ",
        email: "",
        password: "",
        age: "",
        religion: "",
        ethnicity: "",
        interest: "",
        gender: "",
        profilePic: "",
    };
  });
  it('should successfully create a new user', async () => {
    const newUser = {
        name: "test",
        email: "test@gmail.com",
        password: "M12345678",
        age: "18",
        religion: "Muslim",
        ethnicity: "Black",
        interest: "Sport",
        gender: "Male",
        profilePic: "",
    };
  });
});
//delete account
describe('deleteAccount', () => {
  let req, res;

  it('should remove the user from a community and delete the user from the User collection', async () => {
    // Mock Community.updateOne to simulate successful removal from a community
    Community.updateOne.mockResolvedValue({ modifiedCount: 1 });

    // Mock User.findById to simulate finding the user in the User collection
    User.findById.mockResolvedValue({ _id: '12345' });
    User.deleteOne.mockResolvedValue({});

    await deleteAccount(req, res);

    // Assertions
    expect(Community.updateOne).toHaveBeenCalledWith(
      { users: '12345' },
      { $pull: { users: '12345' } }
    );
    expect(User.findById).toHaveBeenCalledWith('12345');
    expect(User.deleteOne).toHaveBeenCalledWith({ _id: '12345' });
    expect(res.cookie).toHaveBeenCalledWith('jwt', '', { maxAge: 0 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User successfully deleted' });
  });

  it('should return 404 if the user is not found in any collection', async () => {
    // Mock Community.updateOne to simulate no community modification
    Community.updateOne.mockResolvedValue({ modifiedCount: 0 });

    // Mock all collections to simulate no user found
    User.findById.mockResolvedValue(null);
    Organizer.findById.mockResolvedValue(null);
    Official.findById.mockResolvedValue(null);

    await deleteAccount(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should handle errors and return 500', async () => {
    // Mock Community.updateOne to simulate an error
    const error = new Error('Database error');
    Community.updateOne.mockRejectedValue(error);

    await deleteAccount(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'An error occurred',
      error: error.message,
    });
  });
});