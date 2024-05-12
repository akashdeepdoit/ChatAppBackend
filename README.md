This is a real-time chat application built using the MongoDB, Express.js, Node.js. It allows users to register, log in, send and receive real-time messages, manage their online status, and integrates with a Large Language Model (LLM) API for generating responses when a user is unavailable.


Features
User Authentication: Users can register with an email and password, and then log in securely using JWT (JSON Web Tokens).
Real-Time Messaging: Utilizes Socket.io for efficient real-time communication, enabling users to send and receive messages instantly.
Message Storage: All messages are stored in a MongoDB database, ensuring they are retrievable for conversations between users.
User Online Status: Users can set their status as 'AVAILABLE' or 'BUSY', which affects their ability to receive messages.
LLM Integration: When a user is 'BUSY', the application generates an appropriate response using a language model API such as ChatGPT, Claude, or Gemini. If the API does not respond within 10 seconds, a standard message indicating unavailability is sent.

Technologies Used
Backend: Node.js, Express.js
Database: MongoDB
Real-Time Communication: Socket.io
Authentication: JWT
