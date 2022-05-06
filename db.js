const mongoose = require("mongoose");

let dbUrl = process.env.DB_URL ;
// || "mongodb://localhost/festdb"

const connecttomongo = async() =>{
    mongoose.connect(dbUrl,{useNewUrlParser: true,useUnifiedTopology:true});
}

module.exports = connecttomongo;