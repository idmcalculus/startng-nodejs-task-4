const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	firstname: { 
			type: String, 
			required: true
		},
	lastname: { 
			type: String, 
			required: true 
		},
	email: { 
			type: String, 
			required: true,
			unique: true,
			lowercase: true,
			validate: value => {
				if (!validator.isEmail(value)) {
					throw new Error({error: 'Invalid Email address'});
				}
			}
		},
	password: { 
			type: String, 
			required: true,
			minLength: 7
		},
	subjects: { 
			type: Array 
		},
	token: {
		type: String,
		required: true
	},
	lessons: [{
		type: Schema.Types.ObjectId,
		ref: 'Lesson'
		}],
	role: { 
		type: String, 
		enum: ['student','tutor','admin'], 
		default: 'student' 
			},
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);

module.exports = User;