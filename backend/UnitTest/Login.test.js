// Import required modules
import { expect } from 'chai';
import sinon from 'sinon';
import { logout, login } from './controllers';
import { handleLogin } from './services';

describe('Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      cookie: sinon.spy(),
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('logout function', () => {
    it('should clear the JWT cookie and return a success message', async () => {
      await logout(req, res);

      expect(res.cookie.calledOnce).to.be.true;
      expect(res.cookie.calledWith('jwt', '', { maxAge: 0 })).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'Logged out successfully' })).to.be.true;
    });

    it('should handle errors and return a 500 status', async () => {
      res.cookie = sinon.stub().throws(new Error('Test Error'));

      await logout(req, res);

      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'Internal Server Error' })).to.be.true;
    });
  });

  describe('login function', () => {
    beforeEach(() => {
      sinon.stub(handleLogin);
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should return 400 if name or password is missing', async () => {
      req.body = { name: 'test' };

      await login(req, res);

      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWith(res.json, { message: 'Name and password are required' });
    });

    it('should call handleLogin when name and password are provided', async () => {
      req.body = { name: 'test', password: '12345' };

      await login(req, res);

      sinon.assert.calledOnce(handleLogin);
      sinon.assert.calledWith(handleLogin, 'test', '12345', res);
    });
  });
});
