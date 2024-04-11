import { Schema, model } from "mongoose";
import { createHmac, randomBytes } from "crypto"
import { setToken } from "../services/auth.js";
let userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImgURL: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
}, { timestamps: true });

userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) return;

    let salt = randomBytes(16).toString();
    let hashedPassword = createHmac('sha256', salt).
        update(user.password).
        digest('hex');
    this.salt = salt;
    this.password = hashedPassword;
    next();
})

userSchema.pre('findOneAndUpdate', async function (next) {
    if ('password' in this._update.$set) {
        let salt = randomBytes(16).toString();
        let hashedPassword = createHmac('sha256', salt)
            .update(this._update.$set.password)
            .digest('hex');
        this._update.$set.salt = salt;
        this._update.$set.password = hashedPassword;
    }
    next();
})

userSchema.static('matchPassword', async function (email, password) {
    let user = await this.findOne({ email });
    if (!user) return false;
    let salt = user.salt;
    let hashedPassword = user.password;
    let userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest('hex');
    if (userProvidedHash === hashedPassword) {
        return setToken(user?.toObject());
    }
})

userSchema.static('matchPasswordOnly', async function (email, password) {
    let user = await this.findOne({ email });
    if (!user) return false;
    let salt = user.salt;
    let hashedPassword = user.password;
    let userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest('hex');
    if (userProvidedHash === hashedPassword) {
        return true;
    } else {
        return false;
    }
})

export let User = model('User', userSchema);