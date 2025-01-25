const express = require("express");
const router = express.Router();

const UserController = require("../Controllers/UserController");
const verifyToken = require("../Middleware/Auth");

router.post("/UserRegistration", (req, res) => UserController.UserRegistration(req, res));
router.post("/UserLogin", (req, res) => UserController.UserLogin(req, res));
router.get("/VerifyToken", verifyToken, (req, res) => UserController.VerifyToken(req, res));
router.get("/GetUser", verifyToken, (req, res) => UserController.GetUser(req, res));
router.put("/UpdateUser", verifyToken, (req, res) => UserController.UpdateUser(req, res));
router.put("/UpdatePassword", verifyToken, (req, res) => UserController.UpdatePassword(req, res));

module.exports = router;