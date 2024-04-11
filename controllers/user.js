import { User } from "../models/user.js";
import { setToken } from "../services/auth.js";

export async function creteNewUser(req, res) {
    try {
        await User.create({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password
        })
            .then((createdUser) => {
                let token = setToken(createdUser?.toObject());
                res.cookie('uid', token, { sameSite: none, secure: true});
                res.status(201).send({ success: true, msg: 'User created successfully' })
            })
            .catch(() => {
                res.send({ success: false, msg: "User exists, login instead" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, msg: 'Internal server error' });
    }
}

export async function getUser(req, res) {
    try {
        let { email, password } = req.body;
        await User.matchPassword(email, password)
            .then((token) => {
                if (token) {
                    res.cookie('uid', token, { domain: req.headers.origin });
                    res.send({ success: true, msg: 'Logged in' });
                }
                else {
                    res.send({ success: false, msg: 'No user found' });
                }
            });
    } catch (error) {
        res.send({ success: false, msg: 'Internal server error' });
        console.log(error);
    }
}


export async function updateUser(req, res) {
    try {
        let updateFields = {};
        if (req.body.fullName != '') updateFields.fullName = req.body.fullName;
        if (req.body.email != '') updateFields.email = req.body.email;
        if (req.body.newPassword != '') updateFields.password = req.body.newPassword;
        if (req.profileImgURL != '') updateFields.profileImgURL = req.profileImgURL;
        User.findOneAndUpdate({ _id: req.user._id }, { $set: updateFields }, { new: true })
            .then((updatedUser) => {
                res.cookie('uid', setToken(updatedUser.toObject()), { domain: req.headers.origin });
                res.send({ success: true, msg: 'User updated successfully' });
            })
            .catch((err) => {
                console.log(err);
                res.send({ success: false, msg: 'You might be trying to update to a email that already exists' });
            });
    } catch (error) {
        console.log(error);
        res.send({ msg: 'internal server error' });
    }
}

export async function getUserInfo(req, res) {
    try {
        if (req.user) {
            let { fullName, email, profileImgURL } = req.user;
            res.send({ fullName, email, profileImgURL });
        } else {
            res.send(null);
        }
    } catch (error) {
        console.log(error);
        res.status(501).send({ msg: 'internal server error' });
    }
}