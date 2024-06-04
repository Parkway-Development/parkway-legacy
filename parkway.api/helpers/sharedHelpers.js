const appError = require('../applicationErrors')

const createAccountNumber = (phoneNumber) => {
    // Format: ####-####-####-####
    // Part 1: 4 digit year
    // Part 2: 2 digit month and 2 digit day
    // Part 3: 2 digit hour and 2 digit minute
    // Part 4: Last 4 digits of the phone number
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');

    const datePart1 = year;
    const datePart2 = month + day;
    const datePart3 = hour + minute;
    
    if(phoneNumber < 4){
        return res.json({accountNumber: null, message: 'No phone number was provided. You must provide a phone number to create an account number.'});
    }
    
    let lastDigits;
    if (phoneNumber.length > 4) {
        lastDigits = phoneNumber.slice(-4);
    } else {
        lastDigits = phoneNumber;
    }

    const accountNumber = `${datePart1}-${datePart2}-${datePart3}-${lastDigits}`;
    return accountNumber;
}

module.exports = {
    createAccountNumber
}