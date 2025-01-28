Collective App

Project Description
Our project aims to assist newcomers, local groups, and parents by addressing challenges in accessing information about their local environment. It provides comprehensive, centralized details about communities, including cultural offerings, public services, and activities, enhanced by visual tools like maps and graphs. Unlike fragmented information sources, our solution fosters a sense of belonging by connecting users to events, opportunities and community engagement.

System Requirements
1. Node.js version 18 or higher 
2. npm version 8 or higher.
3. MongoDB installed and running.

Installation and Running

Frontend
1. Navigate to the Frontend directory:
   cd Collective/frontend
2. Install dependencies:
   npm install
3. Start the local server:
   npm start

Backend
1. Navigate to the Backend directory:
   cd Collective/backend
2. Install dependencies:
   npm install
3. Create a .env file in the root Backend directory with the following content:

   PORT=3000
   MONGO_URI=mongodb://localhost:27017/collective
   JWT_SECRET=your_secret_key

4. Start the server:
   npm start

Tools and Technologies

Frontend:
- React
- React Router
- Zustand
- Chart.js
- Material-UI
- Google Maps API

Backend:
- Node.js
- Express
- MongoDB
- Socket.io
- JWT for user authentication

Basic Usage
1. Open your browser and navigate to:
   - Frontend: http://localhost:3001
2. The Frontend app is connected by default to the Backend server using a proxy.

Important Notes
- To use the Google Map, ensure you provide a valid API key in the Frontend configuration file.
- Automated tests are available in the Frontend via npm test.

Git Code
This file and the entire project code are available on GitHub under [Collective].
To clone the repository:
git clone [https://github.com/Liz-Vainer/Collective.git]
