const express = require("express");
const dotenv = require("dotenv");
const allRoutes = require("./routes.route");
const cors = require("cors");

const connectDB = require("./config/connectDatabase");

dotenv.config();
connectDB();
const PORT = process.env.PORT || 7070;

const app = express();

// to accept JSON data
app.use(express.json());

// Enable CORS for all requests

app.use(cors());

app.use("/api", allRoutes);

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(PORT, console.log(`Server start on port: ${PORT}`));
