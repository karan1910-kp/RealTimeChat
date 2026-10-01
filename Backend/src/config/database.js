const mongoose = require("mongoose")

function connectToDB(){
    mongoose.connect(process.env.MODULE_URI)
    .then(()=>{
        console.log("Your DataBase is Connected Successfully....")
    })
}

module.exports = connectToDB