import * as chai from 'chai';
import chaiHttp from 'chai-http';  
import app from '../index.js'; 
import mongoose from 'mongoose';


chai.use(chaiHttp);  
const { expect } = chai;  

describe('POST /login', () => {
  
  before(async () => {
    // Connect to MongoDB before running tests
    try {
      await mongoose.connect('mongodb://localhost:27017/testdb');
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err);
    }
  });

  after(async () => {
    // Disconnect from MongoDB after tests are done
    await mongoose.connection.close();
  });

  it('should return 400 for invalid credentials', async () => {
    const response = await chai.request(app)
      .post('/login')
      .send({
        name: 'invaliduser',
        password: 'wrongpassword'
      });

    console.log(response.status); // Log the status code
    console.log(response.body);   // Log the response body

    expect(response).to.have.status(400);
    expect(response.body.message).to.equal('Invalid credentials');
  });
});


describe('POST /logout', () => {
  it('should fail because it is in the front navigate', async () => {
    // First, simulate logging in to get a JWT cookie
    const loginResponse = await chai.request(app)
      .post('/login')
      .send({
        name: 'validuser',
        password: 'correctpassword'
      });

    // Assuming the login sets a JWT cookie, we now simulate logging out.
    const response = await chai.request(app)
      .post('/logout')
      .set('Cookie', loginResponse.headers['set-cookie'][0]); // Use the JWT cookie from the login response

    expect(response).to.have.status(200);
    expect(response.body.message).to.equal('Logged out successfully');
    
    expect(response.headers['set-cookie']).to.have.lengthOf(1);
    expect(response.headers['set-cookie'][0]).to.include('jwt=; Max-Age=0');
  });
});
// should be fail there is navigate
describe('POST /logout', () => {
  it('should fail because it is in the front navigate', async () => {
    // First, simulate logging in to get a JWT cookie
    const loginResponse = await chai.request(app)
      .post('/login')
      .send({
        name: 'validuser',
        password: 'correctpassword'
      });

    // Assuming the login sets a JWT cookie, we now simulate logging out.
    const response = await chai.request(app)
      .post('/logout')
      .set('Cookie', loginResponse.headers['set-cookie'][0]); // Use the JWT cookie from the login response

    expect(response).to.have.status(200);
    expect(response.body.message).to.equal('Logged out successfully');
    
    expect(response.headers['set-cookie']).to.have.lengthOf(1);
    expect(response.headers['set-cookie'][0]).to.include('jwt=; Max-Age=0');
  });
});

