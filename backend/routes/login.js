const Joi = require('joi');
const { User } = require('../models/userModel');
const bcrypt=require('bcrypt');
const genAuthToken = require('../utils/getAuthToken');

const router=require('express').Router();

router.post('/', async(req, res)=>{
    const schema=Joi.object({
        email: Joi.string().min(3).max(200).required().email(),
        password: Joi.string().min(6).max(200).required(),
    })
    const {error}=schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let user=await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');
    const isValid=await bcrypt.compare(req.body.password, user.password);
    if(!isValid) return res.status(400).send('Invalid email or password');
    const token=genAuthToken(user)
    res.send(token)
})

module.exports=router;
