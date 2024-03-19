import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const myFirstSecret = process.env.FIRST_SECRET_KEY

const userController = {
    register: async (req, res) => {
        try{
            console.log("try register backend")
            const potential_email = await User.findOne({email:req.body.email})
            console.log("potential_email",potential_email)
            if(potential_email){
                console.log("if potential email")
                res.status(400).json({message: "This email already exists, please log in."})
            }
            const potential_username = await User.findOne({username:req.body.username})
            console.log("potential_username", potential_username)
            if(potential_username){
                console.log("if potential username")
                res.status(400).json({message: "This username already exists, please choose another"})
            }
            else{
                console.log("else register backend")
                const newUser = await User.create(req.body)
                const payload = {
                    id: newUser._id,
                    email: newUser.email
                };
                const userToken = jwt.sign(payload, myFirstSecret);
                console.log(userToken);
                res.status(201).cookie('userToken', userToken, {httpOnly:true}).json(newUser)
            }
        }
            catch(err){
                console.log("catch register backend")
                console.log(err)
                res.status(400).json({error: err})
            }
    },
    login: async (req, res) => {
        try {
            console.log("try login backend")
            const potentialUser = await User.findOne({ email: req.body.email })
            if (!potentialUser) {
                console.log("if !potentialUser backend")
                res.status(400).json({ email: "Email not in database" })
            } else {
                console.log("Else login backend")
                const validPassword = await bcrypt.compare(req.body.password, potentialUser.password)
                if (!validPassword) {
                    res.status(400).json({ password: "Incorrect Password" })
                } else {
                    const payload = {
                        id: potentialUser._id,
                        email: potentialUser.email
                    }
                    const userToken = jwt.sign(payload, myFirstSecret);
                    console.log(userToken);
                    console.log("login potentialUser: ", potentialUser);
                    res.status(201).cookie('userToken', userToken, { httpOnly: true }).json(potentialUser)
                }
            }
        } catch (err) {
            console.log("catch login backend")
            console.log(err)
            res.status(400).json({ error: err })
        }
    },
    getAllUsers: async (req, res) => {
        try {
            console.log("try getAllUsers backend");
            const allUsers = await User.find();
            res.json(allUsers)
        }
        catch(err) {
            console.log("catch getAllUsers backend");
            res.status(400).json({error: err})
        }
    },
    logout: (req, res) => {
        res.clearCookie('userToken').sendStatus(200)
    },
    getOneUser: async (req, res) => {
        try {
            console.log("try getOneUser backend")
            const selectedUser = await User.findById(req.params.id);
            res.json(selectedUser);
        }
        catch(err) {
            console.log("catch getOneUser backend")
            console.log(err);
            res.status(400).json(err);
        }
    },
    editUser: async (req, res) => {
        const options = {
            new: true,
            runValidators: true,
        }
        try {
            console.log("try editUser backend")
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, options);
            res.json(updatedUser);
        }
        catch (err) {
            console.log("catch editUser backend")
            console.log(err);
            res.status(400).json(err)
        }
    },
    deleteUser: async (req, res) => {
        try {
            console.log("try deleteUser backend")
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            res.json(deletedUser)
        }
        catch(err) {
            console.log("catch deleteUser backend")
            console.log(err);
            res.status(400).json(err)
        }
    }
}
export default userController;