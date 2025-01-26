const EntityNotFoundError = require("../Exceptions/EntityNotFoundError");
const Invoice = require("../Models/Invoice");
const InvoiceBook = require("../Models/InvoiceBook");
const User = require("../Models/User");

const GetUserInvoiceBooks = async (req, res) => 
{
    try
    {
        const user = await GetUser(req);

        res.status(200).json(user.invoiceBooks);
    }
    catch(err)
    {
        switch(true)
        {
            case err instanceof EntityNotFoundError:
                res.status(404).json(err);
                break;
            default:
                res.status(500).json(err.message);
                break;
        }
    }
}

const GetInvoiceBook = async (req, res) => 
{
    try
    {
        const user = await GetUser(req);
        const targetId = req.params.id;

        if(user.invoiceBooks.filter((b) => b._id.toString() === targetId).length < 1)
        {
            throw new EntityNotFoundError("Invoice Book not found")
        }

        const target = await InvoiceBook.findById(targetId);

        res.status(200).json(target);
    }
    catch(err)
    {
        switch(true)
        {
            case err instanceof EntityNotFoundError:
                res.status(404).json(err);
                break;
            default:
                res.status(500).json(err.message);
                break;
        }
    }
}

const CreateNewInvoiceBook = async (req, res) =>
{
    try
    {
        const user = await GetUser(req);
        const {name, startingNumber} = req.body;
        const newBook = new InvoiceBook({name, startingNumber, user: user._id});

        user.invoiceBooks.push(newBook);

        await newBook.save();
        await user.save();
        res.status(201).json(newBook);
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}

const UpdateInvoiceBook = async (req, res) =>
{
    try
    {
        const user = await GetUser(req);
        const targetId = req.params.id;
        const {name, logo} = req.body;

        if(user.invoiceBooks.filter((b) => b._id.toString() === targetId).length < 1)
        {
            throw new EntityNotFoundError("Invoice Book not found")
        }

        const target = await InvoiceBook.findById(targetId);
        
        target.name             = name;
        target.logo             = logo;

        await target.save();
        res.status(201).json(target);
    }
    catch(err)
    {
        switch(true)
        {
            case err instanceof EntityNotFoundError:
                res.status(404).json(err);
                break;
            default:
                res.status(500).json({message: err.message});
                break;
        }
    }
}

const CreateNewInvoice = async (req, res) => 
{
    try
    {
        const newData = req.body;
        const user = await GetUser(req);
        const invoiceBookId = req.params.id;

        if(user.invoiceBooks.filter((b) => b._id.toString() === invoiceBookId).length < 1)
        {
            throw new EntityNotFoundError("Invoice Book not found")
        }

        const invoiceBook = await InvoiceBook.findById(invoiceBookId);
        const newInvoice = new Invoice({invoiceBook: invoiceBook._id, isFinal: newData.isFinal, customs: JSON.stringify(newData.customs)});

        newInvoice.invoiceNumber = invoiceBook.startingNumber;

        newInvoice.business.name = newData.business.name;
        newInvoice.business.addressLine1 = newData.business.addressLine1;
        newInvoice.business.addressLine2 = newData.business.addressLine2;
        newInvoice.business.city = newData.business.city;
        newInvoice.business.state = newData.business.state;
        newInvoice.business.zip = newData.business.zip;
        newInvoice.business.email = newData.business.email;
        newInvoice.business.phone = newData.business.phone;
        
        newInvoice.client.name = newData.client.name;
        newInvoice.client.addressLine1 = newData.client.addressLine1;
        newInvoice.client.addressLine2 = newData.client.addressLine2;
        newInvoice.client.city = newData.client.city;
        newInvoice.client.state = newData.client.state;
        newInvoice.client.zip = newData.client.zip;

        newInvoice.subtotal = newData.subtotal;
        newInvoice.taxes = newData.taxes;
        newInvoice.grand_total = newData.grand_total;

        invoiceBook.invoices.push(newInvoice);
        invoiceBook.startingNumber++;

        await newInvoice.save();
        await invoiceBook.save();

        res.status(201).json(newInvoice);
    }
    catch(err)
    {
        switch(true)
        {
            case err instanceof EntityNotFoundError:
                res.status(404).json(err);
                break;
            default:
                res.status(500).json({message: err.message});
                break;
        }
    }
}

const GetUser = async (req) => 
{
    const user = await User.findById(req.userId).select("-password");

    if(!user) {throw new EntityNotFoundError("User not found")}

    return user;
}

module.exports = {
    GetUserInvoiceBooks,
    GetInvoiceBook,
    CreateNewInvoiceBook,
    UpdateInvoiceBook,
    CreateNewInvoice
}