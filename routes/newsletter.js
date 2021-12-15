const router = require("express").Router();
const Newsletter = require('../models/Newsletter.model')
const { sendEmail, sendNewsletterMail } = require('../emailSender')

router.patch("/newsletter/create-entry", async (req, res, next) => {
    try {
        const {email, name} = req.body
        
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
        
        const alreadySubscriped = await Newsletter.findOne({email})
        
        if(alreadySubscriped) {
            return res.status(400).json({
                errorMessage: {
                        message: "Seems like you already subscribed to the Newsletter.",
                        type: 'email'
                    }
                });
        }
                    
        const verificationEmail = (name, email) => {
            const newMail = {
                subject: 'Newsletter Incoming 😊',
                plainText: '',
                htmlText: sendNewsletterMail(name, process.env.ORIGIN + '/newsletter/' + email + '/delete'),
            }
            
            return newMail
        }
                    
        // SEND MAIL
        const {subject, plainText, htmlText} = verificationEmail(name, email)
        sendEmail(email, subject, plainText, htmlText)

        const createdEmail = await Newsletter.create({ email, name })
        return res.status(201).json(createdEmail);
    }
    catch (error) {
        return res.status(404).json({ error: "Error in updating user" + error });
    }
});

router.post("/newsletter/delete", async (req, res, next) => {
    try {
        const {email} = req.body
        const deletedEmail = await Newsletter.findOneAndDelete({ email })
        return res.status(201).json(deletedEmail);
    }
    catch (error) {
        return res.status(404).json({ error: "Error in updating user" + error });
    }
});

module.exports = router;