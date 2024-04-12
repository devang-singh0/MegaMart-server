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

Router.route('/logout').get((req, res) => {
    try{
        res.clearCookie('uid', { domain: 'megamart-server-production-89fhj498fh498jfjfj.up.railway.app', path: '/' });
        res.send({ success: true, msg: 'Logged out' });
    } catch(err){
        res.send({ success: false, msg: 'Internal server error' });
    }
});

export default Router;