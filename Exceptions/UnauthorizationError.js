class UnauthorizationError extends Error
{
    constructor(msg)
    {
        super();
        this.message = msg ?? "User credentials not authorized";
        this.status = 401;
    }
}

module.exports = UnauthorizationError;