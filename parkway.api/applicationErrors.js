class ApplicationError extends Error {
    constructor(message, statusCode, method, errorCode) {
        super(`${message} in method: ${method}`);
        this.statusCode = statusCode;
        this.method = method;
        this.errorCode = errorCode
    }
}

class BadRequest extends ApplicationError {
    constructor(method, 
        customMessage = 'Bad request', 
        customErrorCode = 'REQUESTS_001') {
        super(customMessage, 400, method, customErrorCode);
    }
}

class NotFound extends ApplicationError {
    constructor(method, 
        customMessage = 'Requested item not found', 
        customErrorCode = 'NOT_FOUND_001') {
        super(customMessage, 400, method, customErrorCode);
    }
}

class Unauthorized extends ApplicationError {
    constructor(method,
        customMessage = 'The account is not authorized to make this request', 
        customErrorCode = 'ACCESS_001') {
            super(customMessage, 400, method, customErrorCode);
    }
}

class Forbidden extends ApplicationError {
    constructor(method,
        customMessage = 'The account is forbidden access to this resource', 
        customErrorCode = 'ACCESS_002') {
            super(customMessage, 400, method, customErrorCode);
    }
}

class UpdateFailed extends ApplicationError {
    constructor(method,
        customMessage = 'You attempted to update an item, but the save was not successful', 
        customErrorCode = 'CRUD_001') {
            super(customMessage, 400, method, customErrorCode);
    }
}

class DeleteFailed extends ApplicationError {
    constructor(method,
        customMessage = 'You attempted to delete an item, but the deletion was not successful', 
        customErrorCode = 'CRUD_002') {
            super(customMessage, 400, method, customErrorCode);
    }
}

class InternalServerError extends ApplicationError {
    constructor(method,
        customMessage = 'This is an uncaught error', 
        customErrorCode = 'INTERNAL_SERVER_ERROR_001') {
            super(customMessage, 500, method, customErrorCode);
    }
}

class Validation extends ApplicationError {
    constructor(method,
        customMessage = 'Validation failed for the object in question', 
        customErrorCode = 'VALIDATION_001') {
            super(customMessage, 400, method, customErrorCode);
    }
}

class DepositUnbalanced extends ApplicationError {
    constructor(method,
        customMessage = 'The deposit net amount does not equal the sum of the nets of the contributions and/or donations', 
        customErrorCode = 'DEPOSITS_001') {
            super(customMessage, 400, method, customErrorCode);
    }
}

class DepositDoesNotExist extends ApplicationError {
    constructor(method,
        customMessage = 'The deposit specified does not exist', 
        customErrorCode = 'DEPOSITS_002') {
            super(customMessage, 400, method, customErrorCode);
    }
}

class DuplicateAccount extends ApplicationError {
    constructor(method,
        customMessage = 'An account already exists with that name', 
        customErrorCode = 'ACCOUNTS_001') {
            super(customMessage, 400, method, customErrorCode);
    }
}

class AccountDelete extends ApplicationError {
    constructor(method,
        customMessage = 'You attempted to delete an account, but the delete failed', 
        customErrorCode = 'ACCOUNTS_005') {
            super(customMessage, 400, method, customErrorCode);
    }
}

class MissingRequiredParameter extends ApplicationError {
    constructor(method,
        customMessage = 'The method requires a parameter that was not provided', 
        customErrorCode = 'REQUIRED_PARAMETERS_000') {
            super(customMessage, 400, method, customErrorCode);
    }
}

class MissingDateRange extends ApplicationError {
    constructor(method,
        customMessage = 'The method requires a date range that was not provided via the query string', 
        customErrorCode = 'REQUIRED_PARAMETERS_002') {
            super(customMessage, 400, method, customErrorCode);
    }
}

class MissingRequestBody extends ApplicationError {
    constructor(method,
        customMessage = 'This method requires a request body with particular parameters, but none were provided', 
        customErrorCode = 'REQUIRED_PARAMETERS_003') {
            super(customMessage, 400, method, customErrorCode);
    }
}

class MissingId extends ApplicationError {
    constructor(method,
        customMessage = 'This method requires and Id, but no Id was provided', 
        customErrorCode = 'REQUIRED_PARAMETERS_004') {
            super(customMessage, 400, method, customErrorCode);
    }
}

class InvalidId extends ApplicationError {
    constructor(method,
        customMessage = 'The provided Id is not valid Mongo Id', 
        customErrorCode = 'REQUIRED_PARAMETERS_001') {
            super(customMessage, 400, method, customErrorCode);
    }
}

class ProfileDoesNotExist extends ApplicationError {
    constructor(method,
        customMessage = 'The profile you specified does not exist', 
        customErrorCode = 'PROFILES_001') {
            super(customMessage, 400, method, customErrorCode);
    }
}


module.exports = {
    ApplicationError,
    BadRequest,
    NotFound,
    Unauthorized,
    Forbidden,
    UpdateFailed,
    DeleteFailed,
    MissingRequiredParameter,
    MissingDateRange,
    MissingRequestBody,
    InternalServerError,
    InvalidId,
    MissingId,
    Validation,
    DepositUnbalanced,
    DepositDoesNotExist,
    DuplicateAccount,
    AccountDelete,
    ProfileDoesNotExist
}

