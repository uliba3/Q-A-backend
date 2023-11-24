# QAwebapp Backend

This repository contains the backend code for QAwebapp, a full-stack web application that enables users to post answers to random questions and view responses from other users. The backend is built using Node.js and interacts with a MongoDB database to store and retrieve data. [Live demo](https://white-voice-4708.fly.dev/)

![Alt Text](public\QAwebAppScreenshot.png)

## Technologies Used

- **Node.js:** A JavaScript runtime that executes server-side code. Node.js is used to handle incoming requests, manage the server, and interact with the MongoDB database.

- **Express:** A web application framework for Node.js. Express is utilized to simplify the creation of the backend API and manage routing.

- **MongoDB:** A NoSQL database for storing and managing data. MongoDB is employed to store user answers, questions, and other relevant information.

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:uliba3/Q-A-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Q-A-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the following:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   ```

   Replace `your_mongodb_uri` with the connection string for your MongoDB database.

## Usage

1. Start the server:

   ```bash
   npm start
   ```

2. The server will be running on [http://localhost:5000](http://localhost:5000).

## API Endpoints

- **GET /questions/random**
  - Returns a random question.

- **POST /answers**
  - Create a new answer.

- **GET /answers**
  - Retrieve all answers.

## Contributing

Feel free to contribute to the project by opening issues or submitting pull requests. Follow the [Contribution Guidelines](CONTRIBUTING.md) for more details.


---

**Note:** Ensure that the [frontend](https://github.com/uliba3/Q-A-frontend) is configured to interact with this backend by providing the correct API endpoint URLs and ensuring proper CORS configuration.