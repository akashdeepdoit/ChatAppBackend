const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { initializeSocket } = require("./socket");

dotenv.config();

const app = express();
const server = http.createServer(app);
initializeSocket(server);


app.use(express.json());



app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));


const Message = require('./models/Message');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Db connected");
  } catch (error) {
    console.error(error);
  }
};

connectDB();


app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5200;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
