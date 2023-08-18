const bcrypt=require('bcrypt');
const Joi=require('joi');
const express=require('express');
const {User}=require('../models/userModel');
const genAuthToken = require('../utils/getAuthToken');

const router=express.Router();

router.post('/', async(req, res)=>{
    const schema=Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(3).max(200).required().email(),
        password: Joi.string().min(6).max(1024).required()
    })
    const {error}=schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let user=await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already registered');
    user=new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    const salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password, salt);
    await user.save()
    const token=genAuthToken(user)
    res.send(token);
})

module.exports=router;
