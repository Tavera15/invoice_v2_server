const EntityNotFoundError = require("../Exceptions/EntityNotFoundError");
const UnauthorizationError = require("../Exceptions/UnauthorizationError");
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
        const target = await GetInvoiceBookByReq(req);

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
        const {name, startingNumber, logo} = req.body;
        const newBook = new InvoiceBook({name, startingNumber, logo, user: user._id});

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
        const target = await GetInvoiceBookByReq(req);
        const {name, logo} = req.body;
        
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

const GetInvoice = async (req, res) => 
{
    try
    {
        const invoice = await GetInvoiceByReq(req);

        res.status(200).json(invoice);
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
        const user = await GetUser(req);
        const invoiceBook = await GetInvoiceBookByReq(req);
        
        const newData = req.body;
        const newInvoice = new Invoice({invoiceBook: invoiceBook._id, isFinal: newData.isFinal, customs: JSON.stringify(newData.customs)});

        newInvoice.invoiceNumber            = invoiceBook.startingNumber;
        newInvoice.logo                     = invoiceBook.logo;
        
        newInvoice.business.name            = newData.business.name;
        newInvoice.business.addressLine1    = newData.business.addressLine1;
        newInvoice.business.addressLine2    = newData.business.addressLine2;
        newInvoice.business.city            = newData.business.city;
        newInvoice.business.state           = newData.business.state;
        newInvoice.business.zip             = newData.business.zip;
        newInvoice.business.email           = newData.business.email;
        newInvoice.business.phone           = newData.business.phone;
        
        newInvoice.client.name              = newData.client.name;
        newInvoice.client.addressLine1      = newData.client.addressLine1;
        newInvoice.client.addressLine2      = newData.client.addressLine2;
        newInvoice.client.city              = newData.client.city;
        newInvoice.client.state             = newData.client.state;
        newInvoice.client.zip               = newData.client.zip;

        newInvoice.subtotal                 = newData.subtotal;
        newInvoice.taxes                    = newData.taxes;
        newInvoice.grand_total              = newData.grand_total;
        newInvoice.external_link            = newData.isFinal ? `${process.env.CLIENT_URL}/${invoiceBook._id}/${newInvoice._id}/${user._id}` : "";

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

const UpdateInvoice = async (req, res) => 
{
    try
    {
        const user = await GetUser(req);
        const invoiceBook = await GetInvoiceBookByReq(req);
        const target = await GetInvoiceByReq(req);
        const newData = req.body;

        if(target.isFinal) {throw new UnauthorizationError("Unable to modify finalized invoice")}

        target.business.name            = newData.business.name;
        target.business.addressLine1    = newData.business.addressLine1;
        target.business.addressLine2    = newData.business.addressLine2;
        target.business.city            = newData.business.city;
        target.business.state           = newData.business.state;
        target.business.zip             = newData.business.zip;
        target.business.email           = newData.business.email;
        target.business.phone           = newData.business.phone;
        
        target.client.name              = newData.client.name;
        target.client.addressLine1      = newData.client.addressLine1;
        target.client.addressLine2      = newData.client.addressLine2;
        target.client.city              = newData.client.city;
        target.client.state             = newData.client.state;
        target.client.zip               = newData.client.zip;
        
        target.logo                     = invoiceBook.logo;
        target.customs                  = JSON.stringify(newData.customs);
        target.subtotal                 = newData.subtotal;
        target.taxes                    = newData.taxes;
        target.grand_total              = newData.grand_total;
        target.isFinal                  = newData.isFinal;

        target.external_link            = newData.isFinal ? `${process.env.CLIENT_URL}/${invoiceBook._id}/${target._id}/${user._id}` : ""

        await target.save();

        res.status(200).json(target);
    }
    catch(err)
    {
        switch(true)
        {
            case err instanceof EntityNotFoundError:
                res.status(404).json(err);
                break;
            case err instanceof UnauthorizationError:
                res.status(400).json({message: err.message});
                break;
            default:
                res.status(500).json({message: err.message});
                break;
        }
    }
}

const DeleteInvoice = async (req, res) => 
{
    try
    {
        const invoiceBookId = req.params.id;
        const invoice = await GetInvoiceByReq(req);

        if(invoice.isFinal) {throw new UnauthorizationError("Unable to delete finalized invoice")}
        
        const invoiceBook = await InvoiceBook.findById(invoiceBookId);

        if(invoiceBook.invoices.find((i) => i._id.toString() === invoice._id.toString()))
        {
            invoiceBook.invoices.pull(invoice);
            await invoiceBook.save();
            await Invoice.deleteOne(invoice);

            res.status(200).json(invoiceBook);
        }
        else
        {
            throw new EntityNotFoundError("Invoice not found");
        }
    }
    catch(err)
    {
        switch(true)
        {
            case err instanceof EntityNotFoundError:
                res.status(404).json(err);
                break;
            case err instanceof UnauthorizationError:
                res.status(400).json({message: err.message});
                break;
            default:
                res.status(500).json({message: err.message});
                break;
        }
    }
}

const GetInvoiceExternal = async (req, res) =>
{
    try
    {
        const invoice = await GetInvoiceExternally(req);

        res.status(200).json(invoice);
    }
    catch(err)
    {
        switch(true)
        {
            case err instanceof EntityNotFoundError:
                res.status(404).json(err);
                break;
            case err instanceof UnauthorizationError:
                res.status(400).json({message: err.message});
                break;
            default:
                res.status(500).json({message: err.message});
                break;
        }
    }
}

const CreateNewInvoiceExternal = async (req, res) =>
{
    try
    {
        const auth = await req.params.auth;
        const invoiceBook = await GetInvoiceBookExternally(req);
        const newData = req.body;
        const newInvoice = new Invoice({invoiceBook: invoiceBook._id, isFinal: true, customs: JSON.stringify(newData.customs)});

        newInvoice.invoiceNumber            = invoiceBook.startingNumber;
        newInvoice.logo                     = invoiceBook.logo;

        newInvoice.business.name            = newData.business.name;
        newInvoice.business.addressLine1    = newData.business.addressLine1;
        newInvoice.business.addressLine2    = newData.business.addressLine2;
        newInvoice.business.city            = newData.business.city;
        newInvoice.business.state           = newData.business.state;
        newInvoice.business.zip             = newData.business.zip;
        newInvoice.business.email           = newData.business.email;
        newInvoice.business.phone           = newData.business.phone;
        
        newInvoice.client.name              = newData.client.name;
        newInvoice.client.addressLine1      = newData.client.addressLine1;
        newInvoice.client.addressLine2      = newData.client.addressLine2;
        newInvoice.client.city              = newData.client.city;
        newInvoice.client.state             = newData.client.state;
        newInvoice.client.zip               = newData.client.zip;

        newInvoice.subtotal                 = newData.subtotal;
        newInvoice.taxes                    = newData.taxes;
        newInvoice.grand_total              = newData.grand_total;
        newInvoice.external_link            = `${process.env.CLIENT_URL}/${invoiceBook._id}/${newInvoice._id}/${auth}`;

        invoiceBook.invoices.push(newInvoice);
        invoiceBook.startingNumber++;

        await newInvoice.save();
        await invoiceBook.save();

        res.status(200).json(newInvoice.external_link);
    }
    catch(err)
    {
        switch(true)
        {
            case err instanceof EntityNotFoundError:
                res.status(404).json(err);
                break;
            case err instanceof UnauthorizationError:
                res.status(400).json({message: err.message});
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

const GetUserExternally = async (req) =>
{
    const auth = await req.params.auth;
    const user = await User.findById(auth).select("-password");

    if(!user) {throw new EntityNotFoundError("User not found")}

    return user;
}

const GetInvoiceBookByReq = async (req) =>
{
    const user = await GetUser(req);
    const targetId = req.params.id;

    if(user.invoiceBooks.filter((b) => b._id.toString() === targetId).length < 1)
    {
        throw new EntityNotFoundError("Invoice Book not found")
    }

    return await InvoiceBook.findById(targetId);
}

const GetInvoiceBookExternally = async (req) =>
{
    const user = await GetUserExternally(req);
    const targetId = req.params.id;

    if(user.invoiceBooks.filter((b) => b._id.toString() === targetId).length < 1)
    {
        throw new EntityNotFoundError("Invoice Book not found")
    }

    return await InvoiceBook.findById(targetId);
}

const GetInvoiceByReq = async (req) => 
{
    const invoiceBook = await GetInvoiceBookByReq(req);
    const invoiceId = req.params.invoiceNumber;
    
    if(invoiceBook.invoices.filter((i) => i._id.toString() === invoiceId).length < 1)
    {
        throw new EntityNotFoundError("Invoice not found");
    }

    return await Invoice.findById(invoiceId);
}

const GetInvoiceExternally = async (req) =>
{
    const invoiceBook = await GetInvoiceBookExternally(req);
    const invoiceId = req.params.invoiceNumber;
    
    if(invoiceBook.invoices.filter((i) => i._id.toString() === invoiceId).length < 1)
    {
        throw new EntityNotFoundError("Invoice not found");
    }

    return await Invoice.findById(invoiceId);
}

module.exports = {
    GetUserInvoiceBooks,
    GetInvoiceBook,
    CreateNewInvoiceBook,
    UpdateInvoiceBook,

    GetInvoice,
    CreateNewInvoice,
    UpdateInvoice,
    DeleteInvoice,

    GetInvoiceExternal,
    CreateNewInvoiceExternal
}