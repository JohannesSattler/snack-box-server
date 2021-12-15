const router = require("express").Router();

const {sendEmail, emailVerifivationHTML} = require('../emailSender')

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Session = require("../models/Session.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");


const verificationEmail = (name, id) => {
  const newMail = {
    subject: 'Please Verify your Email 😇',
    plainText: '',
    htmlText: emailVerifivationHTML(name, process.env.ORIGIN + '/user/' + id + '/verify'),
  }

  return newMail
}


router.get("/session", (req, res) => {
  // we dont want to throw an error, and just maintain the user as null
  if (!req.headers.authorization) {
    return res.json(null);
  }

  // accessToken is being sent on every request in the headers
  const accessToken = req.headers.authorization;

  Session.findById(accessToken)
    .populate("user")
    .then((session) => {
      if (!session) {
        return res.status(404).json({ errorMessage: "Session does not exist" });
      }
      return res.status(200).json(session);
    });
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { email, password, passwordReEnter, firstName, lastName } = req.body;

  if(!firstName) {
    return res
      .status(400)
      .json({ errorMessage: {type: 'firstName', message: "Please provide your first name."} });
  }

  if(!lastName) {
    return res
      .status(400)
      .json({ errorMessage: {type: 'lastName', message: "Please provide your last name."} });
  }

  if (!email) {
    return res
      .status(400)
      .json({ errorMessage: {type: 'email', message: "Please provide your email."} });
  }

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

  if(!emailRegex.test(email)) {
    return res.status(400).json({
      errorMessage: {
        message: "The email doesnt seem to be valid.", 
        type: 'email'
      }
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      errorMessage: {
        message: "Your password needs to be at least 8 characters long.", 
        type: 'password'
      }
    });
  }

  const passRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!passRegex.test(password)) {
    return res.status(400).json( {
      errorMessage: {
        message: "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.", 
        type: 'password' 
      }
    });
  }
  
  if(passwordReEnter !== password) {
    return res.status(400).json( {
      errorMessage: {
        message: "Seems like you have entered 2 different passwords!", 
        type: 'passwordReEnter' 
      }
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ email }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res.status(400).json({ errorMessage: {message: "Email already taken.", type: 'email'} });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          email,
          password: hashedPassword,
          firstName,
          lastName,
          isVerified: false,
          signupStage: 0,
        });
      })
      .then((user) => {

        // SEND MAIL
        const {subject, plainText, htmlText} = verificationEmail(user.firstName, user._id)
        sendEmail(user.email, subject, plainText, htmlText)

        Session.create({
          user: user._id,
          createdAt: Date.now(),
        }).then((session) => {
          user.password = '**'
          res.status(201).json({ user, accessToken: session._id });
        });
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: {message: error.message, type: 'unknown'} });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage: {
              message: "Email needs to be unique. The email you chose is already in use.", 
              type: 'email'
            }
          });
        }
        return res.status(500).json({ errorMessage: {message: error.message, type: 'unknown'} });
      });
  });
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email) {
    return res
    .status(400)
    .json({ errorMessage: "Please provide your email." });
  }
  
  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 0) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  
  
  // Search the database for a user with the username submitted in the form
  User.findOne({ email })
  .then((user) => {
    // If the user isn't found, send the message that user provided wrong credentials
    if (!user) {
      return res.status(400).json({ errorMessage: "Wrong credentials." });
    }
    
    // If user is found based on the username, check if the in putted password matches the one saved in the database
    bcrypt.compare(password, user.password).then((isSamePassword) => {
      if (!isSamePassword) {
        return res.status(400).json({ errorMessage: "Wrong credentials." });
      }
      Session.create({ user: user._id, createdAt: Date.now() }).then(
        (session) => {
          return res.json({ user, accessToken: session._id });
        }
        );
      });
    })
    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      //next(err);
      return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.delete("/logout", isLoggedIn, (req, res) => {
  Session.findByIdAndDelete(req.headers.authorization)
    .then(() => {
      res.status(200).json({ message: "User was logged out" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: err.message });
    });
});

module.exports = router;
