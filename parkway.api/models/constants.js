const DepositStatus = Object.freeze({
    UNDEPOSITED: 'undeposited',
    UNALLOCATED: 'unallocated',
    PROCESSED: 'processed'
});

const AccountType = Object.freeze({
    REVENUE: 'revenue',
    FUND: 'fund',
    EXPENSE: 'expense',
    ASSET: 'asset',
    LIABILITY: 'liability',
    CASH: 'cash',
    UNKNOWN: 'unknown'
})

const AccountRestriction = Object.freeze({
    UNRESTRICTED: 'unrestricted',
    RESTRICTED: 'restricted',
    TEMPORARY: 'temporary'
})

const SubscriptionType = Object.freeze({
    // anchor is for early adopter accounts like Parkway.  It never expires
    ANCHOR: 'anchor',
    // free only includes accounting and reporting and is not expandable to other modules
    FREE: 'free', 
    // This includes accounting, reporting, and profile management.  It is not expandable with new modules
    //  if a standard clients wants to add a new module they can either upgraxe to premium or switch to buffet
    //  if they switch to buffett, they maintain the same initial cost and modules, and can add modules as needed
    STANDARD: 'standard', 
    //This includes everything in standard plus any new module that is added 
    PREMIUM: 'premium',  
    //  This starts as a "free" or "standard" subscription, but can add modules as needed.
    BUFFET: 'buffet'
})

const RenewalInterval = Object.freeze({
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    ANNUALLY: 'annually'
})

const ApprovedCountries = Object.freeze({
    US: 'United States'
})

module.exports = {
    DepositStatus,
    AccountType,
    AccountRestriction,
    SubscriptionType,
    ApprovedCountries,
    RenewalInterval
};
