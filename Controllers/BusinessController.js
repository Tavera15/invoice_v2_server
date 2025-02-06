const EntityNotFoundError = require("../Exceptions/EntityNotFoundError");
const Business = require("../Models/Business");
const Customer = require("../Models/Customer");
const ProductService = require("../Models/ProductService");
const User = require("../Models/User");

const GetUserBusinesses = async (req, res) => 
{
    try
    {
        const user = await GetUser(req);

        res.status(200).json(user.businesses);
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

const GetBusiness = async (req, res) => 
{
    try
    {
        const target = await GetBusinessByReq(req);

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

const CreateNewBusiness = async (req, res) =>
{
    try
    {
        const user = await GetUser(req);
        const newData = req.body;

        const newBusiness = new Business({user: user._id});

        newBusiness.name            = newData.name;
        newBusiness.email           = newData.email;
        newBusiness.phone           = newData.phone;
        newBusiness.addressLine1    = newData.addressLine1;
        newBusiness.addressLine2    = newData.addressLine2;
        newBusiness.city            = newData.city;
        newBusiness.state           = newData.state;
        newBusiness.zip             = newData.zip;

        user.businesses.push(newBusiness);

        await newBusiness.save();
        await user.save();
        res.status(201).json(newBusiness);
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}

const UpdateBusiness = async (req, res) =>
{
    try
    {
        const target = await GetBusinessByReq(req);
        const newData = req.body;
        
        target.name            = newData.name;
        target.email           = newData.email;
        target.phone           = newData.phone;
        target.addressLine1    = newData.addressLine1;
        target.addressLine2    = newData.addressLine2;
        target.city            = newData.city;
        target.state           = newData.state;
        target.zip             = newData.zip;

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

const DeleteBusiness = async (req, res) =>
{
    try
    {
        const user = await GetUser(req);
        const target = await GetBusinessByReq(req);

        for(let i = 0; i < target.productServices.length; i++)
        {
            const ps = await ProductService.findById(target.productServices[i]);
            await target.productServices.pull(ps);
            await ProductService.deleteOne(ps);
            await target.save();
        }

        await user.businesses.pull(target);
        await Business.deleteOne(target);
        await user.save();
        
        res.status(200).json(user);
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

const GetAllBusinessProductServices = async (req, res) =>
{
    try
    {
        const business = await GetBusinessByReq(req);

        let allPS = [];

        for(let i = 0; i < business.productServices.length; i++)
        {
            const ps = await ProductService.findById(business.productServices[i]);
            allPS.push(ps);
        }

        res.status(200).json(allPS);
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

const GetSingleBusinessProductService = async (req, res) =>
{
    try
    {
        const target = await GetPSByReq(req);

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
                res.status(500).json({message: err.message});
                break;
        }
    }
}

const CreateNewProductService = async (req, res) => 
{
    try
    {
        const target = await GetBusinessByReq(req);
        const {name, price, description} = req.body;
        const newPS = new ProductService({name, price, description, business: target._id});

        target.productServices.push(newPS);
        await newPS.save();
        await target.save();

        res.status(201).json(target);
    }
    catch(err)
    {
        res.status(500).json({message: err.message});
    }
}

const UpdateProductService = async (req, res) => 
{
    try
    {
        const target = await GetPSByReq(req);
        const {name, price, description} = req.body;

        target.name         = name;
        target.price        = price;
        target.description  = description;

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
            default:
                res.status(500).json({message: err.message});
                break;
        }
    }
}

const DeleteProductService = async (req, res) =>
{
    try
    {
        const business = await GetBusinessByReq(req);
        const target = await GetPSByReq(req);
        
        await business.productServices.pull(target);
        await business.save();
        await ProductService.deleteOne(target);

        res.status(200).json(business);
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

const GetAllBusinessCustomers = async (req, res) => 
{
    try
    {
        const business = await GetBusinessByReq(req);

        let allCustomers = [];

        for(let i = 0; i < business.customers.length; i++)
        {
            const customer = await Customer.findById(business.customers[i]);
            allCustomers.push(customer);
        }

        res.status(200).json(allCustomers);
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

const GetSingleBusinessCustomer = async (req, res) =>
{
    try
    {
        const target = await GetCustomerByReq(req);

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
                res.status(500).json({message: err.message});
                break;
        }
    }
}

const CreateNewCustomer = async (req, res) =>
{
    try
    {
        const target = await GetBusinessByReq(req);
        const newData = req.body;
        const newCustomer = new Customer({business: target._id});

        newCustomer.name              = newData.name;
        newCustomer.addressLine1      = newData.addressLine1;
        newCustomer.addressLine2      = newData.addressLine2;
        newCustomer.city              = newData.city;
        newCustomer.state             = newData.state;
        newCustomer.zip               = newData.zip;

        target.customers.push(newCustomer);
        await newCustomer.save();
        await target.save();

        res.status(201).json(target);
    }
    catch(err)
    {
        res.status(500).json({message: err.message});
    }
}

const UpdateCustomer = async (req, res) =>
{
    try
    {
        const target = await GetCustomerByReq(req);
        const newData = req.body;

        target.name              = newData.name;
        target.addressLine1      = newData.addressLine1;
        target.addressLine2      = newData.addressLine2;
        target.city              = newData.city;
        target.state             = newData.state;
        target.zip               = newData.zip;

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
            default:
                res.status(500).json({message: err.message});
                break;
        }
    }
}

const DeleteCustomer = async (req, res) =>
    {
        try
        {
            const business = await GetBusinessByReq(req);
            const target = await GetCustomerByReq(req);
            
            await business.customers.pull(target);
            await business.save();
            await Customer.deleteOne(target);
    
            res.status(200).json(business);
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

const GetBusinessByReq = async (req) =>
{
    const user = await GetUser(req);
    const businessId = req.params.id;

    if(user.businesses.filter((b) => b._id.toString() === businessId).length < 1)
    {
        throw new EntityNotFoundError("Business not found")
    }

    return await Business.findById(businessId);
}

const GetPSByReq = async (req) =>
{
    const targetId = req.params.ps;
    const business = await GetBusinessByReq(req);

    if(business.productServices.filter((p) => p._id.toString() === targetId).length < 1)
    {
        throw new EntityNotFoundError("Product Service not found")
    }

    return await ProductService.findById(targetId);
}

const GetCustomerByReq = async (req) =>
{
    const targetId = req.params.customer;
    const business = await GetBusinessByReq(req);

    if(business.customers.filter((c) => c._id.toString() === targetId).length < 1)
    {
        throw new EntityNotFoundError("Customer not found");
    }

    return await Customer.findById(targetId);
}

module.exports = {
    GetUserBusinesses,
    GetBusiness,
    CreateNewBusiness,
    UpdateBusiness,
    DeleteBusiness,

    GetAllBusinessProductServices,
    GetSingleBusinessProductService,
    CreateNewProductService,
    UpdateProductService,
    DeleteProductService,

    GetAllBusinessCustomers,
    GetSingleBusinessCustomer,
    CreateNewCustomer,
    UpdateCustomer,
    DeleteCustomer
}