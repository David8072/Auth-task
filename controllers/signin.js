const User = require("../models/User");
const verifyUser = require("../models/verifyUser");
const {sendMail} = require("./Sendmail");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

async function InsertVerifyUser(name, email, password) {
    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const token = generateToken(email);

        const newUser = new verifyUser({
            name: name,
            email: email,
            password: hashedPassword,
            token: token,
        });


        const activationLink = `https://authentication-r9jf.onrender.com/signin/${token}`;
        const content = `<h4> hi, there </h4>
        <h5> Welcome to the app </h5>
        <p> Thankyou for signing up. Click on the below link to activate</p>
        <a href="${activationLink}">Click here</a>
        <p>Regards</p>
        <p>Team</p>`;

        console.log(newUser);
        await newUser.save();
        sendMail(email, "VerifyUser",content);

    } catch (e) {
        console.log(e);

    }
}


function generateToken(email) {
    const token = jwt.sign(email, process.env.signup_Secret_Token);
    return token;
}


async function InsertSignUpUser(token) {
    try {
        const userVerify = await verifyUser.findOne({token:token});
        if (userVerify) {
            const newUser = new User({
                name: userVerify.name,
                email:userVerify.email,
                password: userVerify.password,
                forgetpassword: {},
            });
    
            await newUser.save();
            await userVerify.deleteOne({token:token});
            const content = `<h4> Registeration successful </h4>
            <h5> Welcome to the app </h5>
            <p> you are successfully registered</p>
            <p>Regards</p>
            <p>Team</p>`;
            sendMail(newUser.email, "Registeration successful",content);

            return `<h4> hi, there </h4>
            <h5> Welcome to the app </h5>
            <p> you are successfully registered</p>
            <p>Regards</p>
            <p>Team</p>`;
        };
    
        return `<h4> Registeration failed </h4>
        <p> Link expired......</p>
        <p>Regards</p>
        <p>Team</p>`;
    } catch (e) {
        console.log(e);
        return `<html>
        <body>
        <h4> Registeration failed </h4>
        <p> Unexpected error happenned......</p>
        <p>Regards</p>
        <p>Team</p>
        </body>
        </html>`;
    }
}


module.exports = {InsertVerifyUser, InsertSignUpUser};