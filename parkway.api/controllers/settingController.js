//password settings
const password = async (_, res) => {
    res.status(200).json({
        minimumLength: process.env.MINIMUM_PASSWORD_LENGTH,
        minimumLowercase: process.env.MINIMUM_PASSWORD_LOWERCASE,
        minimumUppercase: process.env.MINIMUM_PASSWORD_UPPERCASE,
        minimumNumbers: process.env.MINIMUM_PASSWORD_NUMBERS,
        minimumSymbols: process.env.MINIMUM_PASSWORD_SYMBOLS
    });
}

module.exports = { 
    password
}