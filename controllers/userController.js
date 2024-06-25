const userModel = require("../models/userModel");
const JWT = require('jsonwebtoken');
//Get all users
const getUsers = (req, res) => {
    userModel.find({}, function (err, result) {
        if (err) {
            res.send({ statusCode: 400, message: "There was a problem adding the information to the database." });
        } else {
            res.send(result);
        }
    })
};


//Update user's details


//Validate the user -> If phonenumber is exists login else register
const validateUsers = async (req, res) => {
    const { PhoneNumber, password } = req.body;

    try {
        const user = await userModel.findOne({ PhoneNumber });
        if (!user) {
            return res.status(400).json({ statusCode: 400, message: "User not found" });
        }
        const isPasswordMatch = await user.validatePassword(password);

        if (isPasswordMatch) {
            const token = JWT.sign({
                id: user._id,
                PhoneNumber: user.PhoneNumber
            }, process.env.JWT_SECRET, { expiresIn: '7d' });

            return res.status(200).json({ statusCode: 200, message: "Login succeed", token });
        } else {
            return res.status(400).json({ statusCode: 400, message: "Password doesn't match" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ statusCode: 500, message: "Internal server error" });
    }
};



//verify token
const verifyToken = (req, res) => {

    const token = req.headers['authorization'];
    const decodeToken = JWT.decode(token);
    try {
        userModel.findById(decodeToken.id)
            .exec((err, result) => {
                if (err) {
                    res.status(400).send({ statusCode: 400, message: "Failed" });
                } else if (!result) {
                    res.status(400).send({ statusCode: 400, message: "Invalid token" });
                } else {
                    if (decodeToken.exp < Date.now() / 1000) {
                        res.status(400).send({ statusCode: 400, message: "Invalid token" });
                    } else {
                        res.status(200).send({ statusCode: 200, result: result });
                    }
                }
            });
    } catch (err) {
        res.send({ statusCode: 400, message: "Failed" });
    };
};

const verifyMobile = (req, res) => {
    const { phone } = req.body
    try {
        userModel.findOne({ PhoneNumber: phone }, ((err, result) => {
            if (err) {
                res.status(400).send({ statusCode: 400, message: "User not valid" })
            } else {
                const genarateOtp = (length = 4) => {
                    let otp = ''
                    for (let i = 0; i < length; i++) {
                        otp += Math.floor(Math.random() * 10)
                    }
                    return otp
                }
                let tempOtp = genarateOtp()
                userModel.findOneAndUpdate({ PhoneNumber: phone }, { Otp: 1234 }, { new: true }, ((er, data) => {
                    if (er) {
                        res.status(400).send({ statusCode: 400, message: "Try again..." })
                    } else {
                        res.status(200).send({ statusCode: 200, phone: phone, message: 'Otp has been send to the respective mail' })
                    }
                }))
            }
        }))
    } catch (err) {
        res.status(500).send({ error: 'Failed verify mobile number' });
    }

}
const forgotPassword = (req, res) => {
    const { phone, otp, newPassword } = req.body
    try {
        userModel.findOne({ PhoneNumber: phone }, ((error, result) => {
            if (result) {
                if (result.Otp === parseFloat(otp)) {
                    result.password = newPassword
                    result.save()
                    return res.status(200).send({ statusCode: 200, message: 'Password updated successfully' });
                    result.Otp === null
                } else {
                    res.status(400).send({ statusCode: 400, message: 'Invalid Otp please enter correct otp' })
                }
            } else {
                res.status(404).send({ statusCode: 404, message: 'Try anain..!' })
            }
        }))
    } catch (err) {
        res.status(500).send({ error: 'Failed verify Otp' });
    }
}

module.exports = {
    getUsers,
    validateUsers,
    verifyToken,
    verifyMobile,
    forgotPassword
}