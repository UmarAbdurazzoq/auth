const { sign, verify } = require("jsonwebtoken")

const JWT  = {
		SECRET: "_edo",
		TIME: 60 * 24 * 7
}


module.exports.sign = payload => sign(
	payload,
	JWT.SECRET,
	{
		expiresIn: JWT.TIME,
	}
)
module.exports.verify = token => verify(token, JWT.SECRET)
