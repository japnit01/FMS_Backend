const mongoose = require("mongoose");

let dbUrl = "mongodb://localhost/festdb" || process.env.DB_URL ;

const connecttomongo = async() =>{
    mongoose.connect(dbUrl,{useNewUrlParser: true,useUnifiedTopology:true});
}

module.exports = connecttomongo;