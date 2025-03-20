const { body, validationResult } = require("express-validator");

const validateProduct = [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("category").notEmpty().withMessage("Category is required"),
    body("stock").isInt({ min: 0 }).withMessage("Stock must be a positive integer"),
    body("image").isURL().withMessage("Image must be a valid URL"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = validateProduct;
