const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 4000;
const mongoose = require("mongoose");

http = require("http");
require('dotenv').config();

const UserRoute             = require("./Routes/UserRoute");
const InvoiceRoute          = require("./Routes/InvoiceRoute");
const BusinessRoute         = require("./Routes/BusinessRoute");

const app = express();
app.use(express.json());
app.use(express.Router());
app.use(cors());
const server = http.createServer(app);

mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => console.log("Connected"))
    .catch(err => console.log(err));

app.use("/api/User", UserRoute);
app.use("/api/Invoice", InvoiceRoute);
app.use("/api/Business", BusinessRoute);

app.get("/", (req, res) => {
    res.status(200).json({message: "Home Page"});
})

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})