const jwt = require("jsonwebtoken");

const authenticate = (req,res,next) => {
    try{
        const autHeader = req.headers.authorization;

        if (!authHeader){
            return res.status(401).json({
                message:"Access denied. No token provided."
            });
        }
    // extracting token
        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(
            token,process.env.JWT_SECRET
        );
        req.user = decoded;
        next();

    } catch (error){
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }

};

module.exports = authenticate;