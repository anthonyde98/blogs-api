const mongoose = require("mongoose");

mongoose
    .connect(process.env.MONGODBURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log(error))