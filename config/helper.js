var fs = require('fs');
const helper = {};
var d = new Date();
// const { logger } = require("../logger/winston");

helper.response = function (response, status_code, message, data) {
	//console.log('------SENDING RESPONSE------', data)
	//console.log('------RESPONSE MESSAGE', message)
	var ret = {
		code: status_code,
		message: message,
	};
	if (data) {
		Object.assign(ret, data);
	}
	//console.log("rawHeaders ------", JSON.stringify(response.rawHeaders));
	//console.log("headers ------", JSON.stringify(response.headers));
	return response.status(status_code).json(ret);
};

helper.sendEstimateMail = (to, from, customers, salesRepInfo, pathToAttachment, fileName) => {
	sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
	//let pathToAttachment = `${__dirname}/attachment.pdf`;
	let attachment = fs.readFileSync(pathToAttachment).toString("base64");
	let names = customers[0].customerFirstname;
	if (customers[1].customerFirstname) {
		names += " and " + customers[1].customerFirstname;
	}

	let message = names + ", \n\n";
	message += 'Thank you for considering 1-800-HANSONS. Your home improvement project deserves the best. We\'re ready to help transform your home with durable, energy-efficient products that can help protect your home and improve your comfort.\n\n';
	message += 'Attached is your estimate for the work we discussed today.  Please contact me if you have any questions.\n\n';
	message += 'Remember, our 1-800-HANSONS Lifetime Guarantee is unmatched in the industry.  If our windows break, roofing leaks, or siding gets damaged, we\'ll fix it. Never worry about window, roofing or siding replacements again. \n\n';
	message += 'We look forward to getting started!\n\n';
	message += salesRepInfo.firstName + ' ' + salesRepInfo.lastName + '\n';
	message += 'Certified Home Improvement Expert at 1-800-HANSONS\n';
	message += 'P: ' + salesRepInfo.mobilePhone + '\n';
	message += 'E: ' + salesRepInfo.email + '\n';
	message += 'Your Trusted Home Improvement Expert for a Lifetime';
	const msg = {
		//to: to,
		personalizations: [
			{
				"to": [
					{
						"email": to, // replace this with your email address
					}
				],
				"cc": [
					{
						"email": salesRepInfo.email
					}
				],
				"bcc": [
					{
						"email": "estimates@hansons.com"
					}
				],
			}
		],
		from: from, // Use the email address or domain you verified above
		subject: 'Thank you for choosing 1-800-HANSONS!',
		text: message,
		//html: '<strong>and easy to do anywhere, even with Node.js shahid</strong>',
		attachments: [
			{
				content: attachment,
				filename: fileName,
				type: "application/pdf",
				disposition: "attachment"
			}
		]
	};
	sendgridMail.send(msg).then((response) => {
		console.log(response[0].statusCode)
		if (response) {
			//console.log(response)
			//console.log(response[0].statusCode)
			//console.log(response[0].headers)
			logger.info(`####### send mail ######### fileName: ${fileName} `);
			console.log("mail sent");
		} else {
			logger.error(`####### send mail failed ######### fileName: ${fileName} `);
			console.log("mail send failed");
		}
	}).catch((error) => {
		console.log("mail send failed");
		console.error(error)
		console.error(error.response.body);
		logger.error(`####### send mail failed ######### fileName: ${fileName} error: ${error}`);
	});
};

helper.sendOrderMail = (to, from, customers, salesRepInfo, attachmentArr) => {
	sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
	//let pathToAttachment = `${__dirname}/attachment.pdf`;
	//let attachment = fs.readFileSync(pathToAttachment).toString("base64");
	let names = customers[0].customerFirstname;
	if (customers[1].customerFirstname) {
		names += " and " + customers[1].customerFirstname;
	}

	let message = names + ", \n\n";
	message += 'Thank you for choosing 1-800-HANSONS for your home improvement project!  We appreciate your business.\n\n';
	message += 'Attached are copies of your Contract Documents. Please review and contact me if you have any questions.\n\n';
	message += 'Sincerely,\n\n';
	message += salesRepInfo.firstName + ' ' + salesRepInfo.lastName + '\n';
	message += 'Certified Home Improvement Expert at 1-800-HANSONS\n';
	message += 'P: ' + salesRepInfo.mobilePhone + '\n';
	message += 'E: ' + salesRepInfo.email + '\n';
	message += 'Your Trusted Home Improvement Expert for a Lifetime';
	const msg = {
		//to: to,
		personalizations: [
			{
				"to": [
					{
						"email": to, // replace this with your email address
					}
				],
				"cc": [
					{
						"email": salesRepInfo.email
					}
				],
				"bcc": [
					{
						"email": "estimates@hansons.com"
					}
				],
			}
		],
		from: from, // Use the email address or domain you verified above
		subject: 'Thank you for choosing 1-800-HANSONS!',
		text: message,
		//html: '<strong>and easy to do anywhere, even with Node.js shahid</strong>',
		// attachments: [
		// 	{
		// 	  content: attachment,
		// 	  filename: fileName,
		// 	  type: "application/pdf",
		// 	  disposition: "attachment"
		// 	}
		//   ]
	};
	if (attachmentArr.length > 0) {
		msg.attachments = attachmentArr
	}
	sendgridMail.send(msg).then((response) => {
		console.log(response[0].statusCode)
		if (response) {
			//console.log(response)
			//console.log(response[0].statusCode)
			//console.log(response[0].headers)
			logger.info(`####### send mail ######### `);
			console.log("mail sent");
		} else {
			logger.error(`####### send mail failed ######### `);
			console.log("mail send failed");
		}
	}).catch((error) => {
		console.log("mail send failed");
		console.error(error)
		console.error(error.response.body);
		logger.error(`####### send mail failed ######### error: ${error}`);
	});
};

helper.sendReceiptMail = (to, from, customers, salesRepInfo, crmAppointmentId, receipt, pathToAttachment, fileName) => {
	sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
	//let pathToAttachment = `${__dirname}/attachment.pdf`;
	let attachment = fs.readFileSync(pathToAttachment).toString("base64");
	let names = customers[0].customerFirstname;
	if (customers[1].customerFirstname) {
		names += " and " + customers[1].customerFirstname;
	}

	let message = names + ", \n\n";
	message += 'We received your payment of $' + receipt.totalAmount + ' from the card ending in (' + receipt.cardNumber + ').  Attached is a receipt for your records.\n\n';
	message += 'If you have questions, please call us at 800-426-7667, press 2, and reference Order ID #' + crmAppointmentId + ' when you speak with a member of our team.\n\n';
	message += 'We look forward to getting started!\n\n';

	message += 'Thank you for choosing 1-800-HANSONS!\n';
	message += 'Your Trusted Home Improvement Expert for a Lifetime';
	const msg = {
		//to: to,
		personalizations: [
			{
				"to": [
					{
						"email": to, // replace this with your email address
					}
				],
				"cc": [
					{
						"email": salesRepInfo.email
					}
				]
			}
		],
		from: from, // Use the email address or domain you verified above
		subject: 'Thank you for choosing 1-800-HANSONS!',
		text: message,
		//html: '<strong>and easy to do anywhere, even with Node.js shahid</strong>',
		attachments: [
			{
				content: attachment,
				filename: fileName,
				type: "application/pdf",
				disposition: "attachment"
			}
		]
	};
	sendgridMail.send(msg).then((response) => {
		console.log(response[0].statusCode)
		if (response) {
			//console.log(response)
			//console.log(response[0].statusCode)
			//console.log(response[0].headers)
			logger.info(`####### send mail ######### fileName: ${fileName} `);
			console.log("mail sent");
		} else {
			logger.error(`####### send mail failed ######### fileName: ${fileName} `);
			console.log("mail send failed");
		}
	}).catch((error) => {
		console.log("mail send failed");
		console.error(error)
		console.error(error.response.body);
		logger.error(`####### send mail failed ######### fileName: ${fileName} error: ${error}`);
	});
};

helper.sendACHMail = (to, from, customers, salesRepInfo, crmAppointmentId, receipt, pathToAttachment, fileName) => {
	sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
	//let pathToAttachment = `${__dirname}/attachment.pdf`;
	let attachment = fs.readFileSync(pathToAttachment).toString("base64");
	let names = customers[0].customerFirstname;
	if (customers[1].customerFirstname) {
		names += " and " + customers[1].customerFirstname;
	}

	let message = "Hi, \n\n";
	message += 'Thank you for choosing 1-800-HANSONS for your home improvement project!  We appreciate your business.\n\n';
	message += 'Attached are copies of your ACH Authorization Form Documents. Please review and contact me if you have any questions.\n\n';

	message += 'Thank you for choosing 1-800-HANSONS!\n';
	message += 'Your Trusted Home Improvement Expert for a Lifetime';
	const msg = {
		//to: to,
		personalizations: [
			{
				"to": [
					{
						"email": to, // replace this with your email address
					}
					// ],
					// "cc": [
					// 	{
					// 	  "email": salesRepInfo.email
					// 	}
				]
			}
		],
		from: from, // Use the email address or domain you verified above
		subject: process.env.NODE_ENV.toUpperCase() + ': ' + crmAppointmentId + ' ACH form',
		//subject: 'Thank you for choosing 1-800-HANSONS!',
		text: message,
		//html: '<strong>and easy to do anywhere, even with Node.js shahid</strong>',
		attachments: [
			{
				content: attachment,
				filename: fileName,
				type: "application/pdf",
				disposition: "attachment"
			}
		]
	};
	sendgridMail.send(msg).then((response) => {
		console.log(response[0].statusCode)
		if (response) {
			//console.log(response)
			//console.log(response[0].statusCode)
			//console.log(response[0].headers)
			logger.info(`####### send mail ######### fileName: ${fileName} `);
			console.log("mail sent");
		} else {
			logger.error(`####### send mail failed ######### fileName: ${fileName} `);
			console.log("mail send failed");
		}
	}).catch((error) => {
		console.log("mail send failed");
		console.error(error)
		console.error(error.response.body);
		logger.error(`####### send mail failed ######### fileName: ${fileName} error: ${error}`);
	});
};


helper.sendMail = (to, from, subject, message) => {
	sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

	const msg = {
		//to: to,
		personalizations: [
			{
				"to": [
					{
						"email": to, // replace this with your email address
					}
				],
				"cc": [
					{
						"email": "hansons@greychaindesign.com"
					}
				],
				"bcc": [
					{
						"email": "shahid@greychaindesign.com"
					}
				]
			}
		],
		from: from, // Use the email address or domain you verified above
		subject: subject, //'Thank you for choosing 1-800-HANSONS!',
		text: message,
		//html: '<strong>and easy to do anywhere, even with Node.js shahid</strong>',
	};
	sendgridMail.send(msg).then((response) => {
		console.log(response[0].statusCode)
		if (response) {
			//console.log(response)
			//console.log(response[0].statusCode)
			//console.log(response[0].headers)
			logger.info(`####### send mail #########`);
			console.log("mail sent");
		} else {
			logger.error(`####### send mail failed ######### `);
			console.log("mail send failed");
		}
	}).catch((error) => {
		console.log("mail send failed");
		console.error(error)
		console.error(error.response.body);
		logger.error(`####### send mail failed ######### fileName: ${fileName} error: ${error}`);
	});
};

helper.generate_jwt = (userId) => {
	var token = jwt.sign({
		id: userId
	}, Config.jwt_secret, {
		expiresIn: '30d'
	});
	return token;
};

helper.cleanArray = (arr1) => {
	var arr = JSON.parse(JSON.stringify(arr1));
	//console.log(Array.isArray(arr));
	if (arr instanceof Array === false) {
		Object.keys(arr).forEach(function (key) {
			if (arr[key] == null) {
				arr[key] = '';
			}
		});
	} else if (arr instanceof Array) {
		arr.map(function (e) {
			//console.log(e)
			//return (e != null) ? e : "";
			Object.keys(e).forEach(function (key) {
				if (e[key] == null) {
					e[key] = '';
				}
			});
		});
	}
	return arr;
};


helper.fillNullInJSON = function (object) {
	Object
		.entries(object)
		.forEach(([k, v]) => {
			if (v && typeof v === 'object')
				helper.fillNullInJSON(v);
			if (v && typeof v === 'object' && !Object.keys(v).length ||
				v === "" ||
				v.length === 0
			) {
				if (Array.isArray(object))
					//object.splice(k, 1);
					object[k] = null;
				else if (!(v instanceof Date))
					//delete object[k];
					object[k] = null;
			}
		});
	return object;
}

helper.updateVersion = async (action, type) => {
	var versionData = await DB.GetData("version", { type: type }, [], {}, true);
	//console.log(versionData)
	if (versionData.length != 0) {
		if (action == "update") {
			//if(versionData.oldVersion == versionData.latestVersion){
			let obj = { latestVersion: versionData.latestVersion + 1, updatedDate: new Date() };
			await DB.updateQuery("version", { id: versionData.id }, obj);
			//}
		} else if (action == "access") {
			let obj = { oldVersion: versionData.latestVersion };
			await DB.updateQuery("version", { id: versionData.id }, obj);
		}
	} else {
		let obj = { oldVersion: 1, latestVersion: 1, type: type, createdDate: new Date(), updatedDate: new Date() };
		await DB.insertQuery("version", obj);
	}
};
helper.get_current_date_time = (format = 'YYYY-MM-DD HH:mm:ss') => {
	return moment().format(format);
};

helper.get_formated_date_time = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
	date = new Date(date);
	return moment(date).format(format);
};



helper.get_sql_date = () => {
	return moment().format('YYYY-MM-DD HH:mm:ss');
};
helper.get_current_year = () => {
	return moment().format('YYYY');
};
helper.get_sql_current_date = () => {
	return moment().format('YYYY-MM-DD');
};

helper.get_sql_date_timezone = (timezone) => {
	return moment1().tz(timezone).format('YYYY-MM-DD');
};

helper.get_sql_date2 = () => {
	return moment().format('YYYY-MM-DD HH:mm:ss');
};

helper.generate_otp = () => {
	return Math.floor(100000 + Math.random() * 900000);
};

helper.ucfirst = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1)
};

helper.format_sql_data = (data) => {
	return JSON.parse(JSON.stringify(data));
};

helper.generate_url = (req) => {
	return req.protocol + '://' + req.hostname + ':' + req.connection.localPort;
};

helper.console = (type, output) => {
	let has_str = "-----------------------------------";
	if (type == null) {
		if (typeof output == 'object') {
			console.log(chalk.blue.bold.inverse(has_str));
			console.log(output);
			console.log(chalk.blue.bold.inverse(has_str));
		} else {
			console.log(chalk.blue.bold.inverse(output));
		}
	} else if (type == true) {
		if (typeof output == 'object') {
			console.log(chalk.green.bold.inverse(has_str));
			console.log(output);
			console.log(chalk.green.bold.inverse(has_str));
		} else {
			console.log(chalk.green.bold.inverse(output));
		}
	} else {
		if (typeof output == 'object') {
			console.log(chalk.red.bold.inverse(has_str));
			console.log(output);
			console.log(chalk.red.bold.inverse(has_str));
		} else {
			console.log(chalk.red.bold.inverse(output));
		}
	}
};

helper.format_phone_number = (phone) => {
	var ph = phone;
	if (phone) {
		ph = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
	}
	return ph;
};

helper.get_index = (array, fieldMap, fieldValue) => {
	let w_ind = array.map(e => e[fieldMap]).indexOf(fieldValue);
	return w_ind;
};

helper.get_index_by_key = (array, fieldMap) => {
	let w_ind = -1;
	array.map((e, k) => { if (e.hasOwnProperty(fieldMap)) { w_ind = k; return false; } });
	return w_ind;
};

helper.toFixedNumber = (number) => {
	const spitedValues = String(number.toLocaleString()).split('.');
	let decimalValue = spitedValues.length > 1 ? spitedValues[1] : '';
	decimalValue = decimalValue.concat('00').substr(0, 2);
	return spitedValues[0] + '.' + decimalValue;
}

helper.generateRandNo = () => {
	let rand_no = Math.random();
	let num = Math.floor(rand_no * 100000000 + 1);
	return num; /*8 digit random number*/
}

helper.getPageNumber = (page, limit) => {
	if (page == 1) {
		var start = 0;
	} else {
		if (page == 0) {
			page = 1;
		}
		page = (page - 1);
		var start = (((limit == undefined || limit == '') ? Config.SETTING.PER_PAGE_RECORD : limit) * page);
	}
	return start;
}

helper.strToLowerCase = (str) => {
	return str == undefined ? '' : helper._trim(str.toLowerCase());
}

helper._replace = (str) => {
	var responce = str == undefined ? '' : str.replace(/[^a-zA-Z0-9 ]/g, "");
	return responce;
}

helper._trim = (str) => {
	var responce = str == undefined ? '' : str.trim();
	return responce;
}

helper.generateRandString = () => {
	return Math.random().toString(36).substring(5);
}

helper.SignNowRequest = function (action = "token", bearerToken, payload) {
	//console.log(NODE_ENV.SIGN_NOW_URL)
	if (action == 'token') {
		var options = {
			'method': 'POST',
			'url': NODE_ENV.SIGN_NOW_URL + '/oauth2/token',
			'headers': {
				'Authorization': NODE_ENV.SIGN_NOW_TOKEN,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			form: {
				"username": NODE_ENV.SIGN_NOW_USER,
				"password": NODE_ENV.SIGN_NOW_PASS,
				'grant_type': 'password'
			}
		};
	} else if (action == 'fieldextract') {
		var options = {
			'method': 'POST',
			'url': NODE_ENV.SIGN_NOW_URL + '/document/fieldextract',
			'headers': {
				'Content-Type': 'multipart/form-data',
				'Authorization': 'Bearer ' + bearerToken
			},
			formData: {
				'file': {
					'value': fs.createReadStream(payload.filePath),
					'options': {
						'filename': payload.filePath,
						'contentType': null
					}
				},
				'Tags': payload.tags
			}
		}
	} else if (action == 'upload') {
		var options = {
			'method': 'POST',
			'url': NODE_ENV.SIGN_NOW_URL + '/document',
			'headers': {
				'Content-Type': 'multipart/form-data',
				'Authorization': 'Bearer ' + bearerToken
			},
			formData: {
				'file': {
					'value': fs.createReadStream(payload.filePath),
					'options': {
						'filename': payload.filePath,
						'contentType': null
					}
				}
			}
		}
	} else if (action == 'invite') {
		var options = {
			'method': 'POST',
			'url': NODE_ENV.SIGN_NOW_URL + '/document/' + payload.document_id + '/invite',
			'headers': {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + bearerToken
			},
			body: JSON.stringify({
				"document_id": payload.document_id,
				//"to": "shahidansari.bit@gmail.com",
				"to": payload.to,
				"from": NODE_ENV.SIGN_NOW_USER,
				//"cc": [
				//"{{user2}}"
				//],
				"subject": "Need your sign: 1-800 Hansons",
				"message": "Please sign on your contract document.",
				"on_complete": "document_and_attachments"
			})
		}
	} else if (action == "status") {
		var options = {
			'method': 'GET',
			'url': NODE_ENV.SIGN_NOW_URL + '/document/' + payload.document_id + '',
			'headers': {
				'Authorization': 'Bearer ' + bearerToken
			}
		};
	} else if (action == "link") {
		var options = {
			'method': 'POST',
			'url': NODE_ENV.SIGN_NOW_URL + '/document/' + payload.document_id + '/download/link',
			'headers': {
				'Authorization': 'Bearer ' + bearerToken
			}
		};
	} else if (action == "fields") {
		var options = {
			'method': 'PUT',
			'url': NODE_ENV.SIGN_NOW_URL + '/document/' + payload.document_id + '',
			'headers': {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + bearerToken
			},
			body: JSON.stringify({
				"client_timestamp": new Date().getTime(),
				"fields": [
					{
						"page_number": 0,
						"type": "signature",
						"name": "",
						"role": "Signer 1",
						"required": true,
						"height": 100,
						"width": 250,
						"x": payload.x,
						"y": payload.y
					},
				]
			})
		};

	} else if (action == "documentgroup") {
		var options = {
			'method': 'POST',
			'url': NODE_ENV.SIGN_NOW_URL + '/documentgroup',
			'headers': {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + bearerToken
			},
			body: JSON.stringify({
				"group_name": payload.group_name,
				"document_ids": payload.document_ids
			})
		};
	} else if (action == "groupinvite") {
		var options = {
			'method': 'POST',
			'url': NODE_ENV.SIGN_NOW_URL + '/documentgroup/' + payload.document_group_id + "/groupinvite",
			'headers': {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + bearerToken
			},
			body: JSON.stringify({
				"invite_steps": payload.invite_steps
			})
		};
	}
	//console.log(options)
	return new Promise((resolve, reject) => {
		request(options, function (error, response, body) {
			if (error) {
				console.log(error);
			} else {
				console.log('Status:', response.statusCode);
				//console.log('Headers:', JSON.stringify(response.headers));
				console.log('Response:', body);
				var responseData = JSON.parse(body);
				//console.log(responseData);
				if (response.statusCode == 200) {
					resolve(responseData);
				} else {
					resolve(false);
				}
				/*if (action == 'token' && response.statusCode == 200 && responseData.access_token) {
					var token = responseData.access_token;
					resolve(token);
				} else if (action == 'upload' && response.statusCode == 200 && responseData.id) {
						var token = responseData.id;
						resolve(token);	
				} else if (action == 'invite' && response.statusCode == 200 && responseData.result == "success") {
						var token = responseData.id;
						resolve(token);	
				} else {
					resolve(false);
				}*/
			}
		});
	});
};

helper.createDirectory = (dirPath) => {
	return new Promise((resolve, reject) => {
		//const documentPath = path.join(process.cwd(), "./public/documents/"+crmAppointmentId+"/"+dirPath);
		//console.log(documentPath); return false;
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
			// } else {
			// 	fs.rmSync(dirPath, { recursive: true });
			// 	fs.mkdirSync(dirPath, { recursive: true });
		}
		resolve(true);
	});
}

helper.base64ToImage = (fileName, base64Image, dirPath) => {
	return new Promise((resolve, reject) => {
		//const documentPath = path.join(process.cwd(), "./public/documents/"+crmAppointmentId+"/"+dirPath);
		const imagePath = dirPath + "\\" + fileName;
		fs.writeFileSync(imagePath, base64Image, { encoding: 'base64' });
		//fs.writeFile(imagePath, base64Image, {encoding: 'base64'}, function(err) {
		//	console.log('File created');
		//});
		resolve(true)
	});
}

helper.sleep = async (time = 5000) => new Promise(resolve => setTimeout(resolve, time));

helper.extractNumber = (str) => {
	let num = str.replace(/[^0-9]/g, '');
	return num;
}

helper.createNetworkDirectory = (crmAppointmentId) => {
	return new Promise((resolve, reject) => {
		//fs.mkdirSync("\\\\serverfile1\\Public\\SSalesAppDocs\\shahid", { recursive: true });
		//const networkFolder = '\\\\serverfile1\\Public\\SSalesAppDocs\\'+process.env.NODE_ENV+'\\';
		const networkFolder = process.env.NETWORK_DIR;
		const dirPath = networkFolder + crmAppointmentId;
		//const documentPath = path.join(process.cwd(), "./public/documents/"+crmAppointmentId+"/"+dirPath);
		//console.log(documentPath); return false;
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
		resolve(true);
	});
}
helper.copyDataToNetworkDirectory = (crmAppointmentId) => {
	return new Promise((resolve, reject) => {
		const documentPath = path.join(process.cwd(), "./public/" + crmAppointmentId + "");
		//const networkFolder = '\\\\serverfile1\\Public\\SSalesAppDocs\\'+process.env.NODE_ENV+'\\';
		const networkFolder = process.env.NETWORK_DIR;
		const dirPath = networkFolder + crmAppointmentId;
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
			// } else {
			// 	fs.rmSync(dirPath, { recursive: true });
			// 	fs.mkdirSync(dirPath, { recursive: true });
		}
		fse.copySync(documentPath, dirPath, { overwrite: true });
		resolve(true);
	});
}

helper.firstLetterCapsEachWord = (str) => {
	var responce = str;
	if (str) {
		str = str.trim();
		const words = str.split(" ");
		responce = words.map((word) => {
			if (word) {
				return word[0].toUpperCase() + word.substring(1);
			}
		}).join(" ");
	}
	return responce;
}

helper.addSlash = (str) => {
	if (str) {
		str = str.replace(/'/g, "\\''");
	}
	return str;
}
helper.stripSlash = (str) => {
	if (str) {
		str = str.replace(/\\'/g, "'");
	}
	return str;
}
module.exports = helper;