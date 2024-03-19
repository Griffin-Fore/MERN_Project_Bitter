import {model, Schema } from 'mongoose';
import bcrypt from 'bcrypt'

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        maxLength: [25, "username cannot exceed 25 characters"]
    },
    user_image_url: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"]
    },
    users_im_following: {
        type: [String]
    }
}, {timestamps: true})

UserSchema.virtual('confirmPassword')
    .get(function() {
        return this._confirmPassword;
    })
    .set(function(value) {
        this._confirmPassword = value
    });

UserSchema.pre('validate', function(next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password')
    }
    next();
});

UserSchema.pre('save',function(next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        });
});

const User = model("User",  UserSchema)

export default User;