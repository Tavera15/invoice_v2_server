const express = require("express");
const router = express.Router();

const InvoiceBookController = require("../Controllers/InvoiceBookController");
const verifyToken = require("../Middleware/Auth");

router.get("/GetUserInvoiceBooks", verifyToken, (req, res) => InvoiceBookController.GetUserInvoiceBooks(req, res));
router.get("/GetInvoiceBook/:id", verifyToken, (req, res) => InvoiceBookController.GetInvoiceBook(req, res));
router.post("/CreateNewInvoiceBook", verifyToken, (req, res) => InvoiceBookController.CreateNewInvoiceBook(req, res));
router.put("/UpdateInvoiceBook/:id", verifyToken, (req, res) => InvoiceBookController.UpdateInvoiceBook(req, res));

module.exports = router;