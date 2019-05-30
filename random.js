var crypto = require("crypto");
key = 'aceasta este o cheie secreta';
module.exports = {
 	createToken: function() {	  
	    return crypto.randomBytes(20).toString('hex');;
 	},
 	createHash: function (text) {
 		return crypto.createHmac('sha1', key).update(text).digest('hex');
 	}
}
