const AppError = require("../applicationErrors");
const mongoose = require("mongoose");

const buildAction = ({ handler, requiredParams, requiredBodyProps, validateIdParam }) => {
    return async (req, res, next) => {
        try {
            const missingParams = [];

            if (requiredParams && Array.isArray(requiredParams) && requiredParams.length > 0) {
                for (const param of requiredParams) {
                    const value = req.params[param];

                    if (value === undefined || value === null) {
                        if (param === 'id') {
                            next(new AppError.MissingId());
                            return;
                        }

                        missingParams.push(param);
                    }

                    if (param === 'id' && validateIdParam) {
                        if (!mongoose.Types.ObjectId.isValid(value)) {
                            next(new AppError.InvalidId());
                            return;
                        }
                    }
                }
            }

            if (requiredBodyProps && Array.isArray(requiredBodyProps) && requiredBodyProps.length > 0) {
                for (const param of requiredBodyProps) {
                    const value = req.body[param];

                    if (value === undefined || value === null) {
                        missingParams.push(param);
                    }
                }
            }

            if (missingParams.length > 0) {
                next(new AppError.MissingRequiredParameter(undefined,
                    `The following parameters are missing: ${missingParams.join(', ')}`));
                return;
            }

            await handler(req, res, next);
        } catch (error) {
            next(error)
            console.error(error);
        }
    };
};

module.exports = {
    buildAction
};
