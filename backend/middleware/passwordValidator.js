//Renforcement du mot de mot de passe
const passwordValidator = require("password-validator");

let passwordSchema = new passwordValidator();

passwordSchema
    .is().min(4)                                    // Minimum length 4
    .is().max(20)                                  // Maximum length 20
    //.has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    //.has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next()
    } else {
        return res.status(400).json({ error: passwordSchema.validate(req.body.password, { list: true }) })
    }
}