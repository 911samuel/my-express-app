"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../testing/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res, next) => {
    try {
        const hashedPassword = await bcryptjs_1.default.hash(req.body.password, 10);
        const newUser = new user_1.default({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            profilePicture: req.body.profilePicture
        });
        const savedUser = await newUser.save();
        const _a = savedUser.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
        const token = jsonwebtoken_1.default.sign({ _id: savedUser._id }, process.env.SECRET || 'I0H1A9G2sam', { expiresIn: '24h' });
        res.status(200).json({ token, user: userWithoutPassword });
    }
    catch (error) {
        next(error);
    }
};
const login = async (req, res, next) => {
    try {
        const user = await user_1.default.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).json('No user with that email found');
        const isValidPassword = await bcryptjs_1.default.compare(req.body.password, user.password);
        if (!isValidPassword)
            return res.status(401).json('Invalid Password');
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.SECRET || 'secret', { expiresIn: "1d" });
        const userWithoutPassword = Object.assign(Object.assign({}, user.toJSON()), { password: undefined });
        res.status(200).send({ token, user: userWithoutPassword });
    }
    catch (error) {
        console.log("Error in Login", error);
        next(error);
    }
};
exports.default = { register, login };
