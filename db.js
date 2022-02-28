const mongoose = require("mongoose");

const connecttomongo = async() =>{
    mongoose.connect("mongodb://localhost/festdb",{useNewUrlParser: true,useUnifiedTopology:true});
}

module.exports = connecttomongo;