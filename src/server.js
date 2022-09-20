const express = require("express");
require("dotenv").config();
require("./connection/connection");
const cors = require('cors');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const commentRoutes = require("./routes/comment");
const auth = require("./middlewares/auth");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors())
app.use(express.json());
app.use('/APIBlog/auth', authRoutes)
app.use('/APIBlog/app', [auth, userRoutes, blogRoutes, commentRoutes]);

app.get("", (req, res) => {
    res.redirect("/APIBlog");
})

app.listen(port, () => console.log("server listening on port", port));