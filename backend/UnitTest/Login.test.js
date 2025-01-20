import * as chai from 'chai';
import chaiHttp from 'chai-http';  // Import chai-http
import app from '../index.js'; // Import your app from index.js

chai.use(chaiHttp);  // Register chai-http with chai
const { expect } = chai;  // Destructure the expect function

describe('POST /login', () => {
  it('should return 400 for invalid credentials', async () => {
    const response = await chai.request(app)
      .post('/login')
      .send({
        name: 'invaliduser',
        password: 'wrongpassword'
      });

    expect(response).to.have.status(400);
    expect(response.body.message).to.equal('Invalid credentials');
  });
});
