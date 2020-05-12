const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
const User = require('../models/user');

dotenv.config();

class UserController {
	static async userSignup (req, res) {

		try {
			const user = new User(req.body);
			if (!user.firstname || !user.lastname || !user.email || !user.password || !user.role) {
				return res.status(400).send({ 
					status: 'error', 
					data: {
						message: "Please fill required fields"
					}
				});
			  }
			const email = user.email;
			const uniqueUser = await User.findOne({ email });
			if (uniqueUser) {
				return res.status(400).send({
					status: 'error',
					data: {
							message: `${email} is already registered`
					}
				});
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(user.password, salt);
			user.password = hashedPassword;
			const accessToken = jwt.sign({email: user.email, userId: user._id }, process.env.JWT_KEY, { expiresIn: '24hr' });
			user.token = accessToken;
			await user.save();
			return res.status(201).send({ 
				status: 'success',
				data: {
					message: "User registered successfully", 
					user
				}
				 });
		} catch (error) {
			res.status(400).send(error);
		}
	}
  
	static async userLogin(req, res) {

		try {
			const { email, password } = req.body;

			const user = await User.findOne({ email });
			if(!user) {
				return res.status(404).send({ 
					status: 'error',
					data: {
						message: "Email address not found, please check your login details! "
					}
				});
			}
			const validPass = await bcrypt.compare(password, user.password);
			if (!validPass) {
				return res.status(404).send({ 
					status: 'error',
					data: {
						message: "Incorrect password provided, please try again "
					}
				});
			}
			const accessToken = jwt.sign({email: user.email, _id: user._id, role: user.role}, process.env.JWT_KEY, { expiresIn: "1hr" });
			const result = await User.findByIdAndUpdate(user._id, {token: accessToken}, { useFindAndModify: false, new: true });
				res.header("x-auth-token", accessToken).status(200).send({
				status: 'success',
				data: {
					message: "Login successful",
					_id: result._id,
					token: result.token
				}
			});
		} catch (error) {
			res.status(400).send(error);
		}
	}

	static async becomeAdmin(req, res) {
		if (!req.user){
			return res.status(401).send('You have to login first');
		  }
		if (req.user.role === 'tutor') {
			try {
			const result = await User.findOneAndUpdate({_id: req.user._id}, { $set: { role: "admin" } }, { useFindAndModify: false, new: true });
			res.status(200).json({
				status: "success",
				data: {
					message: `Congrats ${result.email}! You are now an admin!`,
					role: result.role
				}
				});
			} catch (error) {
				res.status(400).send(error);
			}
		} else if (req.user.role === 'admin') {
			res.status(401).send(`Invalid Request! ${req.user.email} is already an admin`);
		} else {
		res.status(401).send(`Request denied. ${req.user.email} has to be a Tutor`);
		}
	}
  }
  
  module.exports = UserController;