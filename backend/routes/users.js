const {User}=require('../models/userModel');
const {auth, isUser, isAdmin}=require('../middleware/auth');

const moment=require('moment');
const router=require('express').Router();

router.get('/', isAdmin, async(req, res)=>{
    try {
        const users=await User.find().sort({_id: -1});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
})
router.delete('/:id', isAdmin, async(req, res)=>{
    try {
        const deletedUser=await User.findByIdAndDelete(req.params.id);
        res.status(200).send(deletedUser);
    } catch (error) {
        res.status(500).send(error);
    }
})
router.get('/find/:id', isUser, async(req, res)=>{
    try {
        const user=await User.findById(req.params.id);
        res.status(200).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        res.status(500).send(error);
    }
})
router.put('/:id', isUser, async(req, res)=>{
    try {
        const user=await User.findById(req.params.id);
        if(user.email!==req.body.email){
            const emailInUse=await User.findOne({email: req.body.email})
            if(emailInUse){
                return  res.status(400).send("That email is already taken...");
            }
        }
        if(req.body.password && user){
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(req.body.password, salt);
            user.password=hashedPassword;
        }
        const updatedUser=await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            isAdmin: req.body.isAdmin,
            password: req.body.password,
        }, {new: true});
        res.status(200).send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } catch (error) {
        res.status(500).send(error);
    }
})
router.get('/stats', isAdmin, async(req, res)=>{
    const previousMonth=moment()
    .month(moment().month()-1)
    .set('data', 1)
    .format('YYYY-MM-DD HH:mm:ss');
    // res.send(previousMonth);
    try {
        const users=await User.aggregate([
            {
                $match: {createdAt: {$gte: new Date(previousMonth)}},
            },
            {
                $project: {
                    month: {$month: "$createdAt"}
                },
            },
            {
                $group: {_id: "$month", total: {$sum: 1}}
            },
        ]);
        res.status(200).send(users);
    } catch (error) {
        
    }
})

module.exports=router;
