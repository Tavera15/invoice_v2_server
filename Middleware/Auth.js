const jwt = require("jsonwebtoken");
const UnauthorizationError = require("../Exceptions/UnauthorizationError");

const verifyToken = (req, res, next) => 
{
    try
    {
        const token = req.headers[`${process.env.JWT_HEADER}`];
        if(!token) {throw new UnauthorizationError()}
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded) {throw new UnauthorizationError()}
        
        req.userId = decoded.userId;
        next();
    }
    catch(err)
    {
        switch(err)
        {
            case err instanceof UnauthorizationError:
                res.status(401).json(err);
                break;
            default:
                res.status(500).json(err);
                break;
        }
    }
}

module.exports = verifyToken;