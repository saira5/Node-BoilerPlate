/**
 * Site dashboard
 */
exports.index = function(req, res) {
	
	var userId = '';

	if(req.session && req.session.user && req.session.user._id) {
		userId = req.session.user._id;
	}

	res.render('layout', {
		userId: userId
	});
}


/**
 * Get dashboard data
 */
// exports.getDashboardData = function(req, res) {
// 	var async = require('async');
// 	var mongoose = require('mongoose');

// 	var itIncome = mongoose.model('Income');
// 	var ItExpenses = mongoose.model('Expenses');
// 	var Employee = mongoose.model('Employee');
//     var TcIncome = mongoose.model('Student');
//     var TcExpenses = mongoose.model('TcExpenses');
//     var CommonExpenses = mongoose.model('CommonExpenses');



// 	async.parallel({
//         getItIncome: function(callback) {
//             itIncome.find({}, {
//             	amount: true,
//             }).lean().exec(function(err, incRes) {
//                 var totalAmount = 0;
//                 for (var i in incRes) {
//                     totalAmount += incRes[i].amount;
//                 }
//                 callback(null, totalAmount);
//             });
//         },
//         getItExpenses: function(callback) {
//             ItExpenses.find({},{
//             	amount: true,
//             }).exec(function(err, expRes) {
//                 var totalAmount = 0;
//                 for (var i in expRes) {
//                     totalAmount += expRes[i].amount;
//                 }
//                 callback(null, totalAmount);
//             });
//         },
//         getDevelopers: function(callback) {
//             Employee.find({
//              emptype:'developer',
//             }).count(function(err, empRes) {
//                 callback(null, empRes);
//             });
//         },
//         getProfessor: function(callback) {
//             Employee.find({
//                 emptype: 'professor',
//             }).count(function(err, empRes) {
//                 callback(null, empRes);
//             });
//         },
//         getTcIncome: function(callback) {
//             TcIncome.find({},{
//                 feespaid: true,
//             }).exec(function(err, tcInRes) {
//                 var totalAmount = 0;
//                 for (var i in tcInRes) {
//                     totalAmount += tcInRes[i].feespaid;
//                 }
//                 callback(null, totalAmount);
//             });
//         },
//         getTcExpenses: function(callback) {
//             TcExpenses.find({},{
//                 amount: true,
//             }).exec(function(err, tcExRes) {
//                 var totalAmount = 0;
//                 for (var i in tcExRes) {
//                     totalAmount += tcExRes[i].amount;
//                 }
//                 callback(null, totalAmount);
//             });
//         },
//         getExpenses: function(callback) {
//             CommonExpenses.find({},{
//                 amount: true,
//             }).exec(function(err, cExpRes) {
//                 var totalAmount = 0;
//                 for (var i in cExpRes) {
//                     totalAmount += cExpRes[i].amount;
//                 }
//                 callback(null, totalAmount);
//             });
//         }
//     }, function(err, results) {
//     	res.json({
//     		itIncome: results.getItIncome,
//     		itExpenses: results.getItExpenses,
//     		developers: results.getDevelopers,
//             proffesor: results.getProfessor,
//             tcIncome: results.getTcIncome,
//             tcExpenses: results.getTcExpenses,
//             expenses: results.getExpenses,
//     	});
//     });
// }