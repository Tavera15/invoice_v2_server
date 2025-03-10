const express = require("express");
const router = express.Router();

const BusinessController = require("../Controllers/BusinessController");
const verifyToken = require("../Middleware/Auth");

router.get("/GetUserBusinesses", verifyToken, (req, res) => BusinessController.GetUserBusinesses(req, res));
router.get("/GetBusiness/:id", verifyToken, (req, res) => BusinessController.GetBusiness(req, res));
router.post("/CreateNewBusiness", verifyToken, (req, res) => BusinessController.CreateNewBusiness(req, res));
router.put("/UpdateBusiness/:id", verifyToken, (req, res) => BusinessController.UpdateBusiness(req, res));
router.delete("/DeleteBusiness/:id", verifyToken, (req, res) => BusinessController.DeleteBusiness(req, res));

router.get("/GetAllBusinessProductServices/:id", verifyToken, (req, res) => BusinessController.GetAllBusinessProductServices(req, res));
router.get("/GetSingleBusinessProductService/:id/:ps", verifyToken, (req, res) => BusinessController.GetSingleBusinessProductService(req, res));
router.post("/CreateNewProductService/:id", verifyToken, (req, res) => BusinessController.CreateNewProductService(req, res));
router.put("/UpdateProductService/:id/:ps", verifyToken, (req, res) => BusinessController.UpdateProductService(req, res));
router.delete("/DeleteProductService/:id/:ps", verifyToken, (req, res) => BusinessController.DeleteProductService(req, res));

router.get("/GetAllBusinessCustomers/:id", verifyToken, (req, res) => BusinessController.GetAllBusinessCustomers(req, res));
router.get("/GetSingleBusinessCustomer/:id/:customer", verifyToken, (req, res) => BusinessController.GetSingleBusinessCustomer(req, res));
router.post("/CreateNewCustomer/:id", verifyToken, (req, res) => BusinessController.CreateNewCustomer(req, res));
router.put("/UpdateCustomer/:id/:customer", verifyToken, (req, res) => BusinessController.UpdateCustomer(req, res));
router.delete("/DeleteCustomer/:id/:customer", verifyToken, (req, res) => BusinessController.DeleteCustomer(req, res));

module.exports = router;