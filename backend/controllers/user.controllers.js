import { expect } from 'chai';
import sinon from 'sinon';
import { logout } from './controllers';

describe('Logout Controller', () => {
  let req, res, consoleErrorStub;

  beforeEach(() => {
    // יצירת אובייקט req מדומה עם מאפיינים נפוצים
    req = {
      headers: {},
      cookies: { jwt: 'existing-token' }
    };

    // יצירת אובייקט res מדומה עם כל המתודות הנדרשות
    res = {
      cookie: sinon.spy(),
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
      clearCookie: sinon.spy()
    };

    // מעקב אחר קריאות ל-console.error
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Successful Scenarios', () => {
    it('should clear JWT cookie with correct parameters', async () => {
      await logout(req, res);

      expect(res.cookie.calledOnce).to.be.true;
      expect(res.cookie.firstCall.args).to.deep.equal([
        'jwt',
        '',
        { maxAge: 0 }
      ]);
    });

    it('should return 200 status with success message', async () => {
      await logout(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        message: 'Logged out successfully'
      })).to.be.true;
    });

    it('should execute logout operations in correct order', async () => {
      await logout(req, res);

      expect(res.cookie.calledBefore(res.status)).to.be.true;
      expect(res.status.calledBefore(res.json)).to.be.true;
    });
  });

  describe('Error Scenarios', () => {
    it('should handle cookie clearing errors appropriately', async () => {
      res.cookie.throws(new Error('Cookie Error'));
      
      await logout(req, res);

      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(consoleErrorStub.firstCall.args[0]).to.equal('Error logging out:');
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        message: 'Internal Server Error'
      })).to.be.true;
    });

    it('should handle response errors appropriately', async () => {
      res.status.throws(new Error('Response Error'));
      
      await logout(req, res);

      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(res.json.calledWith({
        message: 'Internal Server Error'
      })).to.be.true;
    });

    it('should ensure error logging occurs before error response', async () => {
      res.cookie.throws(new Error('Test Error'));
      
      await logout(req, res);

      expect(consoleErrorStub.calledBefore(res.status)).to.be.true;
      expect(res.status.calledBefore(res.json)).to.be.true;
    });
  });
});