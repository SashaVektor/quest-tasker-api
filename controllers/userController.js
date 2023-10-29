import User from "../models/User.js";
import expressAsyncHandler from "express-async-handler"
import bcrypt from "bcrypt"
import { generateToken } from "../utils.js";

export const signIn = expressAsyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    status: user.status,
                    profession: user.profession,
                    description: user.description,
                    token: generateToken(user)
                })
                return;
            }
        }
        res.status(401).send({ message: "Invalid email or password" })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
})

export const signUp = expressAsyncHandler(async (req, res) => {
    try {
        const person = await User.findOne({ email: req.body.email })

        if (person) {
            throw new Error("User already exist")
        }

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: bcrypt.hashSync(req.body.password, salt),
        })

        const user = await newUser.save();

        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            status: user.status,
            profession: user.profession,
            description: user.description,
            token: generateToken(user)
        })
    } catch (err) {
        res.status(401).send({ message: err.message })
    }
})

export const editUserInfo = expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({ _id: id })
        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.description = req.body.description || user.description;
            user.status = req.body.status || user.status
            user.profession = req.body.profession || user.profession

            const updatedUser = await user.save();
            
            if(!updatedUser) {
                res.status(403).send({message: "Updated not successfully"})
                return
            }

            res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                phone: updatedUser.phone,
                description: updatedUser.description,
                status: updatedUser.status,
                profession: updatedUser.profession,
                token: generateToken(updatedUser)
            })
        } else {
            res.status(404).send({ message: "User not found" })
        }
    } catch (err) {
        res.status(400).send(err)
    }
})
