const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const User = require("../models/User");
const JWT_SECRET=process.env.JWT_SECRET;
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const fetchuser=require('../middlewares/fetchuser')
const { body, validationResult } = require('express-validator');

router.post('/createuser', [
    body('name', "Enter a valid Name").isLength({ min: 3 }),
    body('email', "Enter a valid email").isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success:false,
            errors: errors.array() });
    }
    let user= await User.findOne({email:req.body.email});
    if(user)
    {
        return res.status(400).json({
            success:false,
            message:"Sorry with this email already exists"
        })
    }
    try {
        const salt=await bcrypt.genSalt(10);
        const secPass=await bcrypt.hash(req.body.password,salt);
        user = await User.create({ 
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });
    const data={
        user:{
            id:user.id
        }
    }
      const authtoken=  jwt.sign(data,JWT_SECRET);
      console.log(authtoken);

        res.json({
            success:true,
            authtoken
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success:false,
            message:err
        });
    }
});


router.post('/login', [
   
    body('email', "Enter a valid email").isEmail(),
    body('password', 'Password cannot be blank').exists(),
   
], async (req, res) => { 
    const errors = validationResult(req);
    let success=false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try{
    let user= await User.findOne({email});
    if(!user)
    {
        return res.status(404).json({
            success:false,
            message:"please try lo login with correct credentials"
        })
    }
    const passwordcompare=await bcrypt.compare(password,user.password)
    if(!passwordcompare)
    {
        return res.status(404).json({
            success:false,
            message:"please try lo login with correct credentials"
        })
    }

    const payload={
        user:{
            id:user.id
        }
    }
    const authtoken=  jwt.sign(payload,JWT_SECRET);
    res.status(200).json({
        success:true,
        authtoken
    })
}

   
    catch(error){
        res.status(500).json({
            success:false,
            message:"sorry login with correct credentials"
        })
    }

})

router.post('/getUser',fetchuser,async(req,res)=>{

    try{
       const userid=req.user.id;
       console.log("useridddd",userid)
        const user=await User.findById(userid).select("-password");
        res.send(user);
    }
    catch(error){
        console.log(error.meesage);
        res.status(500).json({
            status:"fail",
            message:"Internal server error"
        })
    }
})



module.exports = router;
