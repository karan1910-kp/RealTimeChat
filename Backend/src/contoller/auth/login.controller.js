const userModel = require("../../module/user.module")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function  userLogin(req,res) {
    const{email,password} = req.body

    const user = await userModel.findOne({email})
    if(!user){
        return res.status(401).json({
        message:"User not Found.."
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(401).json({
        message:"Invalid Password"
        })
    }
    const token = jwt.sign(
    {
        id: user._id
    },
    process.env.JWT_SIGN,
    {
        expiresIn: "7d"
    }
)

res.cookie("token",token,{
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000

})

res.status(200).json({
message:"user Login Successfully",
token,
user:{
name:user.name,
email:user.email
}

})

    
}

module.exports = userLogin