const { jwtSecret } = require("../inc/config");
const jwt = require("jsonwebtoken");
const { tokenBlacklist } = require("../inc/config");

async function authCheck(req,res,next){
    const token = req.headers.authorization;
    const verified = jwt.verify(token,jwtSecret);

    if(tokenBlacklist.includes(token)){
        res.status(404).json({
            msg : "Invalid Token",
            blackList : tokenBlacklist
        })
    }
    
    
    if(verified){
        next();
    }else{
        res.status(404).json({
            msg : "Invalid Token"
        })
    }
    

}


module.exports = authCheck;
