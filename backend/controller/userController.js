const userSchema = require('../model/userModel')

exports.addUser = (req,res) =>{
    const user = new userSchema(req.body);
    user.save()
    .then((data) => {
        if(!data){
            res.json({
                message:"Something went wrong while adding the user.",
                status:400,
                error:err
            })
        }
        else{
            res.json({
                message:"User added successfully.",
                status:200,
                data:data
            })
        }
    }).catch((err) => {
        res.json({
            message:"Something went wrong while adding the user.",
            status:400,
            error:err
        })
    })
}

exports.getUser = (req,res) =>{
    userSchema.find()
    .then((data) => {
        if(!data){
            res.json({
                message:"Something went wrong while fetching the user.",
                status:400,
                error:err
            })
        }
        else{
            res.json({
                message:"User fetched successfully.",
                status:200,
                data:data
            })
        }
    }).catch((err) => {
        res.json({
            message:"Something went wrong while fetching the user.",
            status:400,
            error:err
        })
    })
}

