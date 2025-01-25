const EntityNotFoundError = require("../Exceptions/EntityNotFoundError");
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
    UpdateInvoiceBook
}