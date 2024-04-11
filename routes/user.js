import express from "express";
import { creteNewUser, getUser, updateUser, getUserInfo } from "../controllers/user.js";
import { validateUserUpdate } from "../middlewares/validateUserUpdate.js";
import multer from 'multer';
const Router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        req.profileImgURL = Date.now() + file.originalname;
        cb(null, 'public/profileImages')
    },
    filename: function (req, file, cb) {
        cb(null, req.profileImgURL)
    }
})
let upload = multer({ storage: storage });

Router.route('/')
    .get(getUserInfo)
    .post(creteNewUser)
    .patch(upload.single('profileImg'), validateUserUpdate, updateUser);

Router.route('/login')
    .post(getUser);

export default Router;