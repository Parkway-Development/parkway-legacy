const DepositStatus = Object.freeze({
    UNDEPOSITED: 'undeposited',
    UNALLOCATED: 'unallocated',
    PROCESSED: 'processed'
});

const AccountType = Object.freeze({
    REVENUE: 'revenue',
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

module.exports = {
    DepositStatus,
    AccountType,
    AccountRestriction
};
