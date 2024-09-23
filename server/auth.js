const jwt = require("jsonwebtoken");
require('dotenv').config();

//Token Creation
module.exports.createAccessToken = (user) => {
	const data = {
		id : user._id,
		email: user.email,
		isAdmin : user.isAdmin
	};

	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};

//Token Verification
module.exports.verify = (req, res, next) => {
	console.log(req.headers.authorization);

	let token = req.headers.authorization;

	if(typeof token === "undefined"){
		return res.send({ auth: "Failed. No Token"});
	} else {
		console.log(token);
		token = token.slice(7, token.length);
		console.log(token);

	jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken){
			if(err){
				return res.status(403).send({
					auth: "Failed",
					message: err.message
				});
			} else {
				console.log("result from verify method:")
				console.log(decodedToken);

				req.user = decodedToken;

				next();
			}
		})
	}
}

//Verify Admin
module.exports.verifyAdmin = (req, res, next) => {
	if(req.user.isAdmin){
		next();
	} else {
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}


//Error Handler
module.exports.errorHandler = (res, error, message) => {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message, error: error.message || error });
};

module.exports.isLoggedIn = (req, res, next) => {
	if (req.user) {
		next()
	} else {
		res.sendStatus(401);
	}
}