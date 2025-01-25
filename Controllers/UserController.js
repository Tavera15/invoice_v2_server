const User = require("../Models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const tokenExpiration = "1d";
const UnauthorizationError = require("../Exceptions/UnauthorizationError");

const UserRegistration = async (req, res) =>
{
    try
    {
        const {name, email, password} = req.body;
        const hash = await bcrypt.hash(password, saltRounds);
        const newUser = new User({name, email, password: hash});

        await newUser.save();
        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: tokenExpiration});
        
        res.status(201).json(token);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
}

const UserLogin = async (req, res) => 
{
    try
    {
        const {email, password} = req.body;

        const target = await User.findOne({email});        
        if(!target) {throw new UnauthorizationError()}

        const isPasswordMatch = await bcrypt.compare(password, target.password);
        if(!isPasswordMatch) {throw new UnauthorizationError()}

        const token = jwt.sign({userId: target._id}, process.env.JWT_SECRET_KEY, {expiresIn: tokenExpiration});
        res.status(200).json(token);
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

const VerifyToken = async (req, res) => 
{
    try
    {
        const token = req.headers[`${process.env.JWT_HEADER}`];
        res.status(200).json(token);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
}

const GetUser = async (req, res) =>
{
    try
    {
        const target = await User.findById(req.userId).select("-password");
        res.status(200).json(target);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
}

const UpdateUser = async (req, res) => 
{
    try
    {
        const targetId = req.userId;
        const target = await User.findById(targetId);
        const newData = req.body;
        
        target.name             = newData.name;
        target.email            = newData.email;

        await target.save();
        res.status(200).json(target);
    }
    catch(err)
    {
        switch(err)
        {
            case err instanceof UnauthorizationError:
                res.status(401).json(err);
                break;
            default:
                res.status(500).json("Something went wrong");
                break;
        }
    }
}

const UpdatePassword = async (req, res) =>
{
    try
    {
        const userId = req.userId;
        const {oldPassword, newPassword} = req.body;

        const target = await User.findById(userId);
        const isPasswordMatch =  await bcrypt.compare(oldPassword, target.password);

        if(!isPasswordMatch) {throw new UnauthorizationError()}

        const newHash = await bcrypt.hash(newPassword, saltRounds);
        target.password = newHash;
        await target.save();

        res.status(200).json(target);
    }
    catch(err)
    {
        switch(err)
        {
            case err instanceof UnauthorizationError:
                res.status(401).json(err);
                break;
            default:
                res.status(500).json("Something went wrong");
                break;
        }
    }
}

module.exports = {
    GetUser,
    UserRegistration,
    UserLogin,
    VerifyToken,
    UpdateUser,
    UpdatePassword,
}