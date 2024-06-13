class ApplicationError extends Error {
    constructor(message, statusCode, method, errorCode, originalError = null) {
        super(`${message}. Method: ${method}`);
        this.statusCode = statusCode;
        this.method = method;
        this.errorCode = errorCode;
        this.originalError = originalError;
    }

    toJSON() {
        return {
            message: this.message,
            statusCode: this.statusCode,
            method: this.method,
            errorCode: this.errorCode,
            originalError: this.originalError
        };
    }
}


class BadRequest extends ApplicationError {
    constructor(method, 
        customMessage = 'Bad request', 
        customErrorCode = 'GENERAL_001', 
        originalError = null) {
            super(customMessage, 400, method, customErrorCode, originalError);
    }
}

class NotFound extends ApplicationError {
    constructor(method, 
        customMessage = 'Requested item not found', 
        customErrorCode = 'GENERAL_002', 
        originalError = null) {
            super(customMessage, 404, method, customErrorCode, originalError);
    }
}

class Unauthorized extends ApplicationError {
    constructor(method,
        customMessage = 'The account is not authorized to make this request', 
        customErrorCode = 'GENERAL_003', 
        originalError = null) {
            super(customMessage, 401, method, customErrorCode, originalError);
    }
}
class Forbidden extends ApplicationError {
    constructor(method,
        customMessage = 'The account is forbidden access to this resource', 
        customErrorCode = 'GENERAL_005', 
        originalError = null) {
            super(customMessage, 403, method, customErrorCode, originalError);
    }
}

class CreateFailed extends ApplicationError {
    constructor(method,
        customMessage = 'Could not create the item', 
        customErrorCode = 'GENERAL_004', 
        originalError = null) {
            super(customMessage, 520, method, customErrorCode, originalError);
    }
}

class UpdateFailed extends ApplicationError {
    constructor(method,
        customMessage = 'You attempted to update an item, but the save was not successful', 
        customErrorCode = 'GENERAL_006', 
        originalError = null) {
            super(customMessage, 521, method, customErrorCode, originalError);
    }
}

class DeleteFailed extends ApplicationError {
    constructor(method,
        customMessage = 'You attempted to delete an item, but the deletion was not successful', 
        customErrorCode = 'GENERAL_007', 
        originalError = null) {
            super(customMessage, 522, method, customErrorCode, originalError);
    }
}

class InternalServerError extends ApplicationError {
    constructor(method,
        customMessage = 'This is an uncaught error', 
        customErrorCode = 'GENERAL_008', 
        originalError = null) {
            super(customMessage, 500, method, customErrorCode, originalError);
    }
}

class Validation extends ApplicationError {
    constructor(method, 
        customMessage = 'Validation failed for the object in question', 
        customErrorCode = 'GENERAL_009', 
        originalError = null) {
            super(customMessage, 460, method, customErrorCode, originalError);
    }
}


class MissingRequiredParameter extends ApplicationError {
    constructor(method,
        customMessage = 'The method requires a parameter that was not provided', 
        customErrorCode = 'GENERAL_010', 
        originalError = null) {
            super(customMessage, 461, method, customErrorCode, originalError);
    }
}

//DEPOSITS
class DepositUnbalanced extends ApplicationError {
    constructor(method,
        customMessage = 'The deposit net amount does not equal the sum of the nets of the contributions and/or donations', 
        customErrorCode = 'DEPOSITS_001', 
        originalError = null) {
            super(customMessage, 462, method, customErrorCode, originalError);
    }
}

class DepositDoesNotExist extends ApplicationError {
    constructor(method,
        customMessage = 'The deposit specified does not exist', 
        customErrorCode = 'DEPOSITS_002', 
        originalError = null) {
            super(customMessage, 463, method, customErrorCode, originalError);
    }
}

class DepositAlreadyProcessed extends ApplicationError {
    constructor(method,
        customMessage = 'The deposit has already been processed', 
        customErrorCode = 'DEPOSITS_003', 
        originalError = null) {
            super(customMessage, 464, method, customErrorCode, originalError);
    }
}

//ACCOUNTS
class AccountDoesNotExist extends ApplicationError {
    constructor(method,
        customMessage = 'No account was found', 
        customErrorCode = 'ACCOUNTS_006', 
        originalError = null) {
            super(customMessage, 465, method, customErrorCode, originalError);
    }
}
class DuplicateAccount extends ApplicationError {
    constructor(method,
        customMessage = 'An account already exists with that name and that type.  When creating an account, the combination of the name and type must be unique.', 
        customErrorCode = 'ACCOUNTS_001', 
        originalError = null) {
            super(customMessage, 466, method, customErrorCode, originalError);
    }
}

class AccountDelete extends ApplicationError {
    constructor(method,
        customMessage = 'You attempted to delete an account, but the delete failed', 
        customErrorCode = 'ACCOUNTS_005', 
        originalError = null) {
            super(customMessage, 467, method, customErrorCode, originalError);
    }
}

class InvalidAccountType extends ApplicationError {
    constructor(method,
        customMessage = 'The account type you specified is not valid', 
        customErrorCode = 'ACCOUNTS_006', 
        originalError = null) {
            super(customMessage, 468, method, customErrorCode, originalError);
    }
}

//DATES
class MissingDateRange extends ApplicationError {
    constructor(method,
        customMessage = 'The method requires a date range that was not provided via the query string', 
        customErrorCode = 'REQUIRED_PARAMETERS_002', 
        originalError = null) {
            super(customMessage, 469, method, customErrorCode, originalError);
    }
}
class InvalidDateRange extends ApplicationError {
    constructor(method,
        customMessage = 'The start date must be before the end date', 
        customErrorCode = 'REQUIRED_PARAMETERS_003', 
        originalError = null) {
            super(customMessage, 470, method, customErrorCode, originalError);
    }
}

//ID ISSUES
class MissingId extends ApplicationError {
    constructor(method,
        customMessage = 'This method requires and Id, but no Id was provided', 
        customErrorCode = 'ID_001', 
        originalError = null) {
            super(customMessage, 471, method, customErrorCode, originalError);
    }
}

class InvalidId extends ApplicationError {
    constructor(method,
        customMessage = 'The provided Id is not valid Mongo Id', 
        customErrorCode = 'ID_002', 
        originalError = null) {
            super(customMessage, 472, method, customErrorCode, originalError);
    }
}

//USERS
class DuplicateEmail extends ApplicationError {
    constructor(method,
        customMessage = 'The email you provided already exists and cannot be reused.', 
        customErrorCode = 'USER_001', 
        originalError = null) {
            super(customMessage, 473, method, customErrorCode, originalError);
    }
}

class PasswordStrength extends ApplicationError {
    constructor(method,
        customMessage = 'The password you provided does not meet the specified organizataions complexity requirements.', 
        customErrorCode = 'USER_002', 
        originalError = null) {
            super(customMessage, 474, method, customErrorCode, originalError);
    }
}

class UserDoesNotBelongToOrganization extends ApplicationError {
    constructor(method,
        customMessage = 'The email and password you provided do not belong to the organization you specified.', 
        customErrorCode = 'USER_003', 
        originalError = null) {
            super(customMessage, 475, method, customErrorCode, originalError);
    }
}

class UserDoesNotExist extends ApplicationError {
    constructor(method,
        customMessage = 'No user exists with that email.', 
        customErrorCode = 'USER_004', 
        originalError = null) {
            super(customMessage, 476, method, customErrorCode, originalError);
    }
}

class FailedLogin extends ApplicationError {
    constructor(method,
        customMessage = 'The email and password combination are incorrect.', 
        customErrorCode = 'USER_005', 
        originalError = null) {
            super(customMessage, 477, method, customErrorCode, originalError);
    }
}

class PasswordResetTokenExpired extends ApplicationError {
    constructor(method,
        customMessage = 'The password reset token has expired.', 
        customErrorCode = 'USER_006', 
        originalError = null) {
            super(customMessage, 478, method, customErrorCode, originalError);
    }
}

//PROFILES
class ProfileDoesNotExist extends ApplicationError {
    constructor(method,
        customMessage = 'The profile you specified does not exist', 
        customErrorCode = 'PROFILES_001', 
        originalError = null) {
            super(customMessage, 479, method, customErrorCode, originalError);
    }
}

//CONTRIBUTIONS
class ProtectedContribution extends ApplicationError {
    constructor(method,
        customMessage = 'The contribution is protected because it belongs to a processed deposit.', 
        customErrorCode = 'CONTRIBUTIONS_001', 
        originalError = null) {
            super(customMessage, 480, method, customErrorCode, originalError);
    }
}

class ContributionDoesNotExist extends ApplicationError {
    constructor(method,
        customMessage = 'The contribution specified does not exist.', 
        customErrorCode = 'DONATIONS_001', 
        originalError = null) {
            super(customMessage, 481, method, customErrorCode, originalError);
    }
}

//DONATIONS
class DonationDoesNotExist extends ApplicationError {
    constructor(method,
        customMessage = 'The donation specified does not exist.', 
        customErrorCode = 'DONATIONS_001', 
        originalError = null) {
            super(customMessage, 482, method, customErrorCode, originalError);
    }
}

//ORGANIZATIONS
class OrganizationDoesNotExist extends ApplicationError {
    constructor(method,
        customMessage = 'The organization specified does not exist.', 
        customErrorCode = 'ORGANIZATIONS_001', 
        originalError = null) {
            super(customMessage, 483, method, customErrorCode, originalError);
    }
}

class OrganizationOriginNotSpecified extends ApplicationError {
  constructor(method,
              customMessage = 'Origin could not be resolved.',
              customErrorCode = 'ORGANIZATIONS_002') {
    super(customMessage, 400, method, customErrorCode);
  }
}

//CLAIMS
class InvalidClaimValue extends ApplicationError {
    constructor(method,
        customMessage = 'The value specified for the claim is invalid.', 
        customErrorCode = 'ORGANIZATIONS_001', 
        originalError = null) {
            super(customMessage, 484, method, customErrorCode, originalError);
    }
}

//TRANSACTIONS
class TransactionFailed extends ApplicationError {
    constructor(method,
        customMessage = 'The transaction was not saved.', 
        customErrorCode = 'ORGANIZATIONS_001', 
        originalError = null) {
            super(customMessage, 485, method, customErrorCode, originalError);
    }
}

//DEVELOPER
class DuplicateApplication extends ApplicationError {
    constructor(method,
        customMessage = 'An application already exists with that name.', 
        customErrorCode = 'DEVELOPER_001', 
        originalError = null) {
            super(customMessage, 486, method, customErrorCode, originalError);
    }
}

module.exports = {
    ApplicationError,
    BadRequest,
    NotFound,
    Unauthorized,
    Forbidden,
    CreateFailed,
    UpdateFailed,
    DeleteFailed,
    MissingRequiredParameter,
    MissingDateRange,
    InvalidDateRange,
    InternalServerError,
    InvalidId,
    MissingId,
    Validation,
    DepositUnbalanced,
    DepositDoesNotExist,
    DepositAlreadyProcessed,
    DuplicateAccount,
    AccountDelete,
    AccountDoesNotExist,
    InvalidAccountType,
    ProfileDoesNotExist,
    ProtectedContribution,
    ContributionDoesNotExist,
    DonationDoesNotExist,
    OrganizationDoesNotExist,
    OrganizationOriginNotSpecified,
    DuplicateEmail,
    PasswordStrength,
    UserDoesNotBelongToOrganization,
    UserDoesNotExist,
    FailedLogin,
    InvalidClaimValue,
    PasswordResetTokenExpired,
    TransactionFailed,
    DuplicateApplication
}

