// Import required modules
import { expect } from 'chai'; // Chai for assertions
import sinon from 'sinon';    // Sinon for mocking and spying
import { logout } from './controllers'; // Adjust the path to your logout function

describe('logout function', () => {
  let req, res;

  // Setup mock objects before each test
  beforeEach(() => {
    req = {}; // Mock request object (not used in the function)
    res = {
      cookie: sinon.spy(), // Spy on the cookie method
      status: sinon.stub().returnsThis(), // Stub the status method to enable chaining
      json: sinon.spy(), // Spy on the json method
    };
  });

  // Cleanup after each test
  afterEach(() => {
    sinon.restore();
  });

  // Test for successful logout
  it('should clear the JWT cookie and return a success message', async () => {
    await logout(req, res);

    // Assertions for clearing the JWT cookie
    expect(res.cookie.calledOnce).to.be.true;
    expect(res.cookie.calledWith('jwt', '', { maxAge: 0 })).to.be.true;

    // Assertions for status code 200
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;

    // Assertions for the success message
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Logged out successfully' })).to.be.true;
  });

  // Test for handling errors
  it('should handle errors and return a 500 status', async () => {
    // Simulate an error by making res.cookie throw an error
    res.cookie = sinon.stub().throws(new Error('Test Error'));

    await logout(req, res);

    // Assertions for status code 500
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(500)).to.be.true;

    // Assertions for the error message
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Internal Server Error' })).to.be.true;
  });
});
