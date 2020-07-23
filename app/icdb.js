'use strict';
const querystring = require('querystring');
var QRCode = require('qrcode');
const nodemailer = require("nodemailer");
var fs = require('fs');
// var csv = require("fast-csv");
const csvParser = require('csv-parser');
const csv = require('csvtojson');


var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	async = require('async'),
		uid = require('uid'),
		fs = require('fs'),
		request = require('request'),
		helperCTRL = require('./helper');
require('date-utils');

var filePath = {
	1: __dirname + '/../../public/assets/uploads/users/'
};


function sendProductVerification(result) {
	async function main() {

		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			auth: {
				user: 'abc@gmail.com',
				pass: 'T@1971'


			}
		});

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: '"Abc" <abc@gmail.com>', // sender address
			to: "", // list of receivers
			subject: "Product Activation! ✔", // Subject line
			html: `<h1>Hello  </h1><p> This product ${result.name} need to be activated<br>
    
    	 Have a nice day !        `
		});

	}

	main().catch(console.error);

}


/**
 *
 */
exports.getSingle = function (req, res) {

	if (!req.body.model || !req.body._id) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	commonModel.findById(req.body._id, function (err, result) {

		res.json(result);
		console.log(result)
	});
};


exports.addCsvTags = function (req, res) {

	var counttag = 0;
	var countsavetag = 0;
	var countrecieved = 0;

	console.log("Inside of file route")
	console.log("file", req.files);
	console.log("file name" + req.files.tagFile.name);

	if (!req.files) {
		res.send("File was not found");
		return;
	}


	var commonModel = mongoose.model("Tags");

	commonModel.find().sort({
			$natural: -1
		})
		.limit(1).exec(function (err, responseData) {

			if (err) {
				res.json({
					status: false

				});
				return;
			} else {
				let integer;
				if (responseData.length > 0) {
					console.log("response data:", responseData);

					console.log("response data:", responseData[0].JeptagID);
					let str = responseData[0].JeptagID;
					str = str.slice(3);
					console.log("string after :" + str)
					integer = parseInt(str, 10);
				} else {
					integer = 0;
				}
				console.log("count int :" + integer)
				console.log("count int add 5 :" + integer + 5)

				let csvData = req.files.tagFile.data.toString('utf8');
				return csvtojson().fromString(csvData).then(json => {

					json.forEach(function (item) {
						countrecieved++;
						console.log("Count of tag recieved" + countrecieved);
						console.log("TAGGGGGG IDDD :" + item.TagID)
						commonModel.findOne({
							TagID: item.TagID
						}, function (err, result) {

							if (!result) {
								integer = integer + 1;
								var taglist = new commonModel({
									TagType: item.TagType,
									TagID: item.TagID,
									SellerID: item.SellerId,
									BusinessID:item.BusinessID,
									ProductID:item.ProductID,
									TagLat:item.TagLat,
									TagLong:item.TagLong,
									AddedBy:item.AddedBy,
									createdAt: new Date().getTime(),
									JeptagID: "Jep" + integer

								})
								console.log("taglist obj" + taglist)
								taglist.save();
								countsavetag++;
								console.log("Count of tag saved" + countsavetag);
							} else {
								console.log("Tag ALREDAY PRESENT")
								counttag++;
								console.log("count of tag duplicated" + counttag);


							}

						});

					});

				})

			}


		});

	return res.json({
		status: true
	});



};


exports.getSingleData = function (req, res) {

	if (!req.body.model || !req.body._id) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	commonModel.findById(req.body._id, function (err, result) {
		//console.log("store  result" + result)

		return res.json({
			status: true,
			result: result
		});
	});
};
exports.getData = function (req, res) {

	console.log("request received !");
	if (!req.body.model) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	commonModel.find().exec(function (err, responseData) {

		if (err) {
			res.json({
				status: false,
				data: responseData
			});
			return;
		}
		console.log("response of call");
		res.json(responseData);
		return;
	});
};

exports.getCondition = function (req, res) {
	console.log(req.body.model)
	console.log(req.body.condition)

	if (!req.body.model) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	commonModel.find(req.body.condition).exec(function (err, responseData) {

		if (err) {
			res.json({
				status: false,
				data: responseData
			});
			return;
		}


		res.json(responseData)

		return;


	});
};


/**
 *
 */
exports.getEditData = function (req, res) {
	console.log(req.body)
	if (!req.body.model) {
		return res.json([]);
	}
	console.log("Start")
	var commonModel = mongoose.model(req.body.model);

	console.log("below model")
	commonModel.update({
		_id: req.body._id
	}, req.body, {
		multi: true
	}).exec(function (err, result) {

		console.log("inside exec ")
		if (err) {
			console.log("ERROR" + err)
		}

		console.log("below if err check")
		console.log("RESULT " + result)
		res.json({
			status: true,
			result: result
		});
	});
};




/**
 *
 */
exports.commonUploadFile = function (req, res) {

	var fileObject = req.files.file,
		destinationpath = filePath[req.params.key];

	var extArray = fileObject.originalFilename.split('.');
	var ext = extArray[extArray.length - 1];
	var fileName = uid(10) + '.' + ext;

	fs.readFile(fileObject.path, function (err, data) {

		if (err) {
			res.send(err);
			return;
		}

		var newPath = destinationpath + fileName;

		fs.writeFile(newPath, data, function (err) {
			if (err) {
				res.send(err);
				return;
			}
			res.send({
				original: req.files.file.name,
				image: fileName,
				status: true
			});
			return;
		});
	});
};



/**
 *
 */
exports.postUpdateChildData = function (req, res) {

	if (!req.body.model || !req.body.entityId) {
		return res.json([]);
	}

	var commonModel = mongoose.model(req.body.model);
	var entityId = req.body.entityId,
		childEntityId = req.body.childEntityId,
		entityKey = req.body.entityKey;

	delete req.body.entityId;
	delete req.body.childEntityId;
	delete req.body.entityKey;


	var saveData = function () {

		var updateData = {};
		for (var row in req.body) {
			updateData[row] = req.body[row];
		}

		var condition = {
			_id: entityId
		};

		var pull = {};
		pull[entityKey] = {
			_id: mongoose.Types.ObjectId(childEntityId)
		}

		var push = {};
		updateData._id = mongoose.Types.ObjectId(childEntityId);
		push[entityKey] = updateData;

		commonModel.update({
			'_id': entityId
		}, {
			$pull: pull
		}).exec(function (err, result) {

			if (err) {
				res.json({
					status: false,
					err: err
				});
				return;
			}


			commonModel.update({
				'_id': entityId
			}, {
				$push: push
			}).exec(function (err, result) {

				if (err) {
					res.json({
						status: false,
						err: err
					});
					return;
				}

				var sendRS = function () {
					res.json({
						status: true,
						result: updateData
					});
				}

				switch (entityKey) {
					case 'something':
						break;
					default:
						sendRS();
						break;
				}
				return;
			});
		});
	}


	if (req.body.tags) {
		getDynamicTagsByName(req.body.tags, function (tags) {
			req.body.tags = tags;
			saveData();
		});
	} else {
		saveData();
	}
}



/**
 *
 */
exports.postUpdateData = function (req, res) {

	if (!req.body.model || !req.body.entityId) {
		return res.json([]);
	}

	commonModel.update({
		'_id': req.body.entityId
	}, req.body).exec(function (err, result) {
		res.json(result);
	});
}




exports.postAddData = function (req, res) {

	console.log("Request data", req.body)
	if (!req.body.model) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);
	req.body.model = '';
	req.body.createdAt = new Date().getTime();


	var commonFormData = new commonModel(req.body);

	commonFormData.save(function (err, result) {

		console.log(result);
		if (err) {
			console.log(err);
			res.json({
				status: false
			});
			return;
		}
		console.log("Below error");
	//	console.log("Response data" + result)

		res.json({
			status: true,
			result: result
		});
	});
	console.log("Above return");

	return;
}


exports.addDemoConditions = function (req, res) {


	var commonModel = mongoose.model("conditionS");
	req.body.createdAt = new Date().getTime();

	var commonFormData = new commonModel({
		name: "used"
	});

	commonFormData.save(function (err, result) {

		console.log(result);
		if (err) {
			console.log(err);
			res.json({
				status: false
			});
			return;
		}
		console.log("Below error");
		res.json({
			status: true,
			result: result
		});
	});
	console.log("Above return");

	return;
}

/**
 *
 */
exports.getDeleteData = function (req, res) {
	console.log("product deleted route callled " + req.body._id)

	if (!req.body.model || !req.body._id) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	// Delete common Data
	commonModel.findOne({
		_id: req.body._id
	}).remove(function (err, result) {
		if (err) {
			console.log("err ")

			res.json({
				status: false
			});
			return;
		} else {
			console.log(" deleted ")

			res.json({
				status: true,
				responseIds: req.body._id
			});
			return;
			console.log("product deleted ")
		}
	});

};


/**
 *
 */
exports.getDeleteDataCondition = function (req, res) {

	if (!req.body.model || !req.body._id) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	// Delete common Data
	commonModel.find(req.body.condition).remove(function (err, result) {

		if (err) {
			res.json({
				status: false
			});
			return;
		}

		res.json({
			status: true
		});
		return;
	});
}


