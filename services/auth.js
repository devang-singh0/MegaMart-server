import jwt from "jsonwebtoken";

const secretKey = 'FJTIKTIHKL';

export function setToken(user) {
    return jwt.sign(user, secretKey);
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return { error: error.message };
    }
}