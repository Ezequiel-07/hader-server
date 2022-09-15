const express = require("express");
const morgan = require("morgan");
const mod = require("method-override");
const path = require("path");
const cors = require("cors");
const cloudinary = require("cloudinary");
const postsRoutes = require("./routes/postsRoutes");
const usersRoutes = require("./routes/usersRoutes");
const dataRoutes = require("./routes/dataRoutes");
const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
}) 

require("./server/mongodb");
app.set("port", 7530);

app.use(cors());
app.use(mod("_method"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended:false }));
app.use(express.json());
app.use(postsRoutes);
app.use(usersRoutes);
app.use(dataRoutes);

app.listen(process.env.PORT || app.get("port"));
console.log(`server on port: ${process.env.PORT || app.get("port")}`);
