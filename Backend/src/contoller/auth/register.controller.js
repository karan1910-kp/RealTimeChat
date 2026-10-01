const userModel = require("../../module/user.module")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



async function userRegister(req,res){
    const {name,email,password} = req.body

    const isUserExist = await userModel.findOne({email})
    if(isUserExist){
        return res.status(409).json({
            message:"User already exist "
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
    name,email,password:hash
    })

   const token = jwt.sign({
    id:user._id,
   },
   process.env.JWT_SIGN,{expiresIn:"1d"}
)
   res.cookie("token",token)


    res.status(201).json({
        message:"user are registered successfully",
        user:{
            name:user.name,
            email:user.email
        }
    })

}

module.exports=userRegister