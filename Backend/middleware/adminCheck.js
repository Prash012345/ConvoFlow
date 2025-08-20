const { jwtSecret } = require("../inc/config");
const jwt = require("jsonwebtoken");
const { Employee } = require("../inc/db");


async function adminCheck(req,res,next){
    const token = req.headers.authorization;
    const decoded = jwt.decode(token);
    const search = decoded.email;

    const details = await Employee.findOne({
        email : search
    })

    const userType = details.role;

    console.log(userType);

    if(userType === "admin"){
        next();
    }else{
        res.json({
            msg : "You are not an admin"
        })
    }
}

module.exports = adminCheck;
