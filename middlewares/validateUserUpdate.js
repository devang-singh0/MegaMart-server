import { User } from "../models/user.js";
import fs from 'fs'
export function validateUserUpdate(req, res, next) {
    User.matchPasswordOnly(req.user.email, req.body.password)
        .then((matched) => {
            if (matched){
                req.user.profileImgURL && req.user.profileImgURL != 'default.jpg' && fs.unlink(`public/profileImages/${req.user.profileImgURL}`, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    }
                });
                return next();
            };
            req.profileImgURL && req.profileImgURL != 'default.jpg' && fs.unlink(`public/profileImages/${req.profileImgURL}`, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
            res.send({ success: false, msg: 'Invalid Credentials' });
        })
}