const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mobileEnrichmentSchema = new Schema(
    {
        full_name:{
            type:String,
            // required:true,
            trim:true,
        },
        lead_location: {
            type: [String], // Define lead_location as an array of strings
            default: [], // Set a default value of an empty array
        },
        mobile_1:{
            type:String,
            // required:true,
            trim:true,
            unique:true
        },
        mobile_2: {
            type: String,
            // required: false,
            default: null,
        },
        mobile_1_status:{
            type:String,
            // required:true,
            trim:true,
        },
        mobile_2_status:{
            type:String,
            // required:true,
            trim:true,
        },
        mobile_1_country:{
            type:String,
            // required:true,
            trim:true,
        },
        mobile_2_country:{
            type:String,
            // required:true,
            trim:true,
        },
        linkedin_url:{
            type:String,
            trim:true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('MobileEnrichmentModel',mobileEnrichmentSchema)