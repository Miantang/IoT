var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;

var strLenValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 225],
        message: '×Ö·û´®³¤¶È·¶Î§ÊÇ[1, 225]'
    })
];
var IpSchema = new Schema({
    type: String,
    ip : { type: String, required: true, validate: strLenValidator },
    camIp : { type: String, required: true, validate: strLenValidator }
});

module.exports = mongoose.model('Ip', IpSchema);