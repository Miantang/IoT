var UserModel = require('../models/user');

var isAdmin = function (req, res, next) {
    UserModel.findOne({ uid: "admin" }, function (err, admin) {
        if (err) {
            if (!config.production) {
                res.send(err);
            } else {
                res.status(404);
                res.end();
            }
        } else {
            if (admin !== null && admin.pwd === req.pwd) {
                next();
            } else {
                res.json({ Error: 'wrong password for admin' });
            }
        }
    });
};
var getUser = function (req, res) {
    res.json({'method': 'get'});
};
var postUser = function (req, res) {
    var user = req.body;
    var uid = user.uid;
    var pwd = user.pwd;
    UserModel.findOne({uid: uid}, function (err, u) {
        if(err) console.error(err);
        if( !u ) {
            return res.redirect('/');
        }
    })
};
var signup = function (req, res) {
    var _user = req.body.user;
    var user = new UserModel(_user);
    user.save();
    res.redirect('/');
};

var login = function (req, res) {
    var user = req.body;
    var uid = user.username;
    var pwd = user.pwd;
    UserModel.findOne({uid: uid}, function (err , u) {
        if (err) console.log(err);
        if(!u) {
            return res.redirect('/');
        }
        
        if(u.isRight(pwd)) {
            req.session.user = u;
            console.log("login succeed!");
            return res.json({'username': uid});
        } else {
            console.log("cant login");
        }
    });
};
var logout = function (req, res) {
    delete req.session.user;
    res.redirect('/');
};
// middleware for user
var loginRequired = function(req, res, next) {
    var user = req.session.user;

    if (!user) {
        console.log("should login");
        return res.redirect('/login');
    }
    next();
};

var adminRequired = function(req, res, next) {
    var user = req.session.user;

    if (user !== 'admin') {
        return res.redirect('/login');
    }

    next();
};

module.exports = {
    getUser: getUser,
    postUser: postUser,
    signup: signup,
    logout: logout,
    login: login
};
