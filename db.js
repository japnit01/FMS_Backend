const mongoose = require("mongoose");

// let dbUrl = process.env.DB_URL ;
let dbUrl = "mongodb://localhost:27017/festdb"

const connecttomongo = async() =>{
    mongoose.connect(dbUrl,{useNewUrlParser: true,useUnifiedTopology:true});
}

module.exports = connecttomongo;