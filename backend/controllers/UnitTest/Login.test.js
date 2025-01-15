const { expect } = require('chai');
const sinon = require('sinon');
const { login } = require('./user.controllers'); 
const handleLogin = require('./path-to-handleLogin'); 

// Mock handleLogin
sinon.stub(handleLogin);

describe('login controller', () => {
  let req, res;

  beforeEach(() => {
    // Mock request and response objects
    req = { body: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore(); // Restore original behavior for all stubs and mocks
  });

  it('should return 400 if name or password is missing', async () => {
    req.body = { name: '', password: '' }; // Empty values

    await login(req, res);

    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnceWith({ message: 'Name and password are required' })).to.be.true;
  });

  it('should call handleLogin if name and password are provided', async () => {
    req.body = { name: 'testuser', password: 'testpassword' };

    await login(req, res);

    expect(handleLogin.calledOnceWith('testuser', 'testpassword', res)).to.be.true;
  });
});
