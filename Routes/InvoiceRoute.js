const express = require("express");
const router = express.Router();

const InvoiceBookController = require("../Controllers/InvoiceController");
const verifyToken = require("../Middleware/Auth");

router.get("/GetUserInvoiceBooks", verifyToken, (req, res) => InvoiceBookController.GetUserInvoiceBooks(req, res));
router.get("/GetInvoiceBook/:id", verifyToken, (req, res) => InvoiceBookController.GetInvoiceBook(req, res));
router.post("/CreateNewInvoiceBook", verifyToken, (req, res) => InvoiceBookController.CreateNewInvoiceBook(req, res));
router.put("/UpdateInvoiceBook/:id", verifyToken, (req, res) => InvoiceBookController.UpdateInvoiceBook(req, res));

router.get("/GetInvoice/:id/:invoiceNumber", verifyToken, (req, res) => InvoiceBookController.GetInvoice(req, res));
router.post("/CreateNewInvoice/:id", verifyToken, (req, res) => InvoiceBookController.CreateNewInvoice(req, res));
router.put("/UpdateInvoice/:id/:invoiceNumber", verifyToken, (req, res) => InvoiceBookController.UpdateInvoice(req, res));
router.delete("/DeleteInvoice/:id/:invoiceNumber", verifyToken, (req, res) => InvoiceBookController.DeleteInvoice(req, res));


router.get("/GetInvoiceExternal/:id/:invoiceNumber", (req, res) => InvoiceBookController.GetInvoiceExternal(req, res));
router.post("/CreateNewInvoiceExternal/:id", (req, res) => InvoiceBookController.CreateNewInvoiceExternal(req, res));


module.exports = router;