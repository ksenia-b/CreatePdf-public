"use strict";

/**
 * Created by ksu on 17.09.2016.
 */
var phantom = require('phantom');
var nodemailer = require('nodemailer');

var sitepage = null;
var phInstance = null;
var siteUrl = "http://google.com"; //there may be kibana report link

phantom.create()
	.then(instance => {
		phInstance = instance;
		return instance.createPage();
	}).then(page => {
	sitepage = page;
	page.property('viewportSize', {width: 1100, height: 600}).then(function () {
		return page.open(siteUrl);
	});

}).then(status => {
	console.log(status);
	setTimeout(function () {
		sitepage.render('graphs.pdf').then(function () {
			console.log('Page Rendered');
			sendEmail();
			sitepage.close();
			phInstance.exit();
		});
	}, 120000);

});

function sendEmail () {
	// create reusable transporter object using the default SMTP transport
	var transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true, // use SSL
		auth: {
			user: 'user e-mail',  //you should to add your e-mail and password
			pass: 'user password'
		}
	});

	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: '"Oksana B." <emailadress@gmail.com>', // sender address
		to: 'emailadress@gmail.com',
		subject: 'Graphs report ✔', // Subject line
		text: 'Weekly report', // plaintext body
		html: '<b>Weekly report</b>', // html body
		attachments: [{
			filename: 'graphs.pdf',
			path: './graphs.pdf',
			contentType: 'application/pdf'
		}]
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});
}
