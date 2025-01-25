class PasswordNotMatchError extends Error
{
    constructor()
    {
        super();
        this.message = "Password does not match account";
        this.status = 401;
    }
}

module.exports = PasswordNotMatchError;