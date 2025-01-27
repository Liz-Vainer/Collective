import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import sinon from 'sinon';
import User from '../models/user.js'; 
import { expect } from 'chai';

chai.use(chaiHttp);

  describe('POST /accept Friend Request', () => {
    it('should accept a friend request and add both users as friends', async () => {
      const mockUser = {
        _id: 'user1',
        friendRequests: ['requesterId'],
        friends: [],
        save: sinon.stub().resolves()
      };
      const mockRequester = {
        _id: 'requesterId',
        friends: [],
        save: sinon.stub().resolves()
      };

        sinon.stub(User, 'findById')
        .onCall(0).resolves(mockUser) // First call returns mockUser
        .onCall(1).resolves(mockRequester); // Second call returns mockRequester

      // Mock the socket ID retrieval function
      const getReceiverSocketId = sinon.stub().callsFake((id) => `${id}SocketId`);
      global.getReceiverSocketId = getReceiverSocketId;

      const res = await chai.request(app)
        .post('/accept Friend Request')
        .send({ requesterId: 'requesterId' })
        .set('Authorization', 'Bearer valid-jwt-token'); // Adjust according to your authentication method

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Friend request accepted!');
      expect(res.body.friends).to.deep.equal([mockRequester]);
      expect(res.body.requestes).to.deep.equal([]);

      // Check if socket emits were called for both users
      expect(getReceiverSocketId.calledTwice).to.be.true;

      // Restore the stubs after the test
      User.findById.restore();
      getReceiverSocketId.restore();
    });

    it('should return 404 if user or requester not found', async () => {
      sinon.stub(User, 'findById').resolves(null); // Simulate user not found

      const res = await chai.request(app)
        .post('/accept Friend Request')
        .send({ requesterId: 'requesterId' })
        .set('Authorization', 'Bearer valid-jwt-token');

      expect(res.status).to.equal(404);
      expect(res.body.error).to.equal('User not found');

      User.findById.restore();
    });
});


   