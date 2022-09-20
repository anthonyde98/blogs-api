const blogSchema = require("../models/blog");

const existeBlog = async (id) => {
    const blog = await blogSchema.findById(id);

    if(blog){
        return true;
    }

    return false;
}

module.exports = {
    existeBlog
}