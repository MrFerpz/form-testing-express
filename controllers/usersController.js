const { body, validationResult } = require("express-validator");

// text to be shown to user when validating error
const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "must be a valid email address.";
const ageErr  = "must be an age between 18 and 120";
const bioErr = "must be below 200 characters"

const validateUser = [
    body("firstName").trim()
      .isAlpha().withMessage(`First name ${alphaErr}`)
      .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
    body("lastName").trim()
      .isAlpha().withMessage(`Last name ${alphaErr}`)
      .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
    body("email").trim().isEmail().withMessage(`Email ${emailErr}`),
    body("age").trim().isInt({min: 18, max: 120}).withMessage(`Age ${ageErr}`),
    body("bio").trim().escape().isLength({min: 1, max: 200}).withMessage(`Bio ${bioErr}`)
  ];

const usersStorage = require('../storages/usersStorage');

exports.usersListGet = (req, res) => {
    res.render("index", {
        title: "User list",
        users: usersStorage.getUsers()
    })
}

exports.usersCreateGet = (req, res) => {
    res.render("createUser", { title: "New User Form" })
}

// we pass an array of middleware validations to our controller
exports.usersCreatePost = [
    // first validate the data
    validateUser,
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("createUser", {
          title: "Create user",
          errors: errors.array(),
        });
      }
      // if successful, add user
      const { firstName, lastName, email, age, bio } = req.body;
      usersStorage.addUser({ firstName, lastName, email, age, bio });
      res.redirect("/");
    }
  ];


exports.usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render("updateUser", {
        title: "Update user",
        user: user,
        });
    };

exports.usersUpdatePost = [
    validateUser,
    (req, res) => {
        const user = usersStorage.getUser(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).render("updateUser", {
            title: "Update user",
            user: user,
            errors: errors.array(),
        });
        }
        const { firstName, lastName, email, age, bio } = req.body;
        usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio });
        res.redirect("/");
    }
];

exports.deleteUserPost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect("/")
}
