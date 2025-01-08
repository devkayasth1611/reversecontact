const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        userEmail:{
            type:String,
            required:true,
            trim:true
        },
        userPassword:{
            type:String,
            required:true,
            trim:true
        }
    },
    {
        timestamps:true,
    }
)

module.exports = mongoose.model('User',userSchema)