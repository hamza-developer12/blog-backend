const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const blogRoutes = require("./routes/blog.routes");
const contactRoutes = require("./routes/contact.routes");
require("dotenv").config();
const app = express();
const path = require("path");
app.use(cors())
app.use(express.json());

//static files

const port = process.env.PORT || 3000;


mongoose.connect("mongodb+srv://hamzaazam411:Frontier123@cluster0.ooq84zu.mongodb.net/Blog").then(() => {
    console.log("Connected to db");

}).catch(error => console.log(error.message))


app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes)
app.use("/api/contact", contactRoutes);
app.listen(3000, () => { console.log(`Listening on port ${port}`) })