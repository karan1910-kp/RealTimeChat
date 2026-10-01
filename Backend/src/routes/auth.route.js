const express = require("express")
const userRegister = require("../contoller/auth/register.controller")
const userLogin = require("../contoller/auth/login.controller")
const getMe = require("../contoller/auth/me.controller");
const authMiddleware = require("../middleware/auth.middleware");
const deleteAccount = require("../contoller/auth/deleteAccount.controller");
const verifyPassword = require("../contoller/auth/verifyPassword.controller");


const authRouter = express.Router()

authRouter.post("/register",userRegister)
authRouter.post("/login",userLogin)
authRouter.get("/me", authMiddleware,getMe);
authRouter.post("/verify-password",authMiddleware,verifyPassword);
authRouter.delete("/account",authMiddleware,deleteAccount);


module.exports=authRouter