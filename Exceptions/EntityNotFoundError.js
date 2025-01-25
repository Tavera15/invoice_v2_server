class EntityNotFoundError extends Error
{
    constructor(msg)
    {
        super();
        this.message = msg;
        this.status = 404;
    }
}

module.exports = EntityNotFoundError;