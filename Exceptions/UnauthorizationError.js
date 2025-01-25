class UnauthorizationError extends Error
{
    constructor()
    {
        super();
        this.message = "User credentials not authorized";
        this.status = 401;
    }
}

module.exports = UnauthorizationError;