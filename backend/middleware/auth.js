const jwt=require('jsonwebtoken');

const auth=(req, res, next)=>{
    const token=req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. Not Authenticated...');
    try {
        const secretKey=process.env.JWT_SECRET_KEY;
        const user=jwt.verify(token, secretKey);
        req.user=user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).send('Invalid auth token');
    }
}

const isUser=(req, res, next)=>{
    auth(req, res, ()=>{
        if(req.user.id===req.params.id || req.user.isAdmin){
            next();
        } else{
            res.status(403).send('Access Denied. Not authorized');
        }
    })
}

const isAdmin=(req, res, next)=>{
    auth(req, res, ()=>{
        if(req.user.isAdmin){
            next()
        }
        else{
            return res.status(403).send('Access Denied. Not Authorized...');
        }
    });    
}

module.exports={auth, isAdmin, isUser};

