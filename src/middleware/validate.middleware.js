import { body, validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';


export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError('Validation error', 400, errors.array()));
    }
    next();
};

export const validateUserRegistration = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 6})
        .withMessage('Name must be between 6 long')
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage('Name must contain only letters and spaces'),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'g')
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('department')
        .notEmpty()
        .withMessage('Department is required'),
    body('profilePicture')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new ApiError('Profile picture is required', 400);
            }
            return true;
        })

];

export const validateUserLogin = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'g')
        .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number ')
];


export default{
    handleValidationErrors,
    validateUserRegistration,
    validateUserLogin
}