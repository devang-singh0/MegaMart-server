import { verifyToken } from "../services/auth.js";

export async function isLoggedIn(req, res, next) {
    const token = req.cookies?.uid;
    if (token) {
        try {
            let user = verifyToken(token);
            if (user) {
                req.user = user;
            }
        } catch (err) {
            console.error(err);
        }
    }
    next();
}