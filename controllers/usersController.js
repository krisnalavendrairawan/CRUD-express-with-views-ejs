const connection = require('../library/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = 'secret';
class usersController {

    
    //get route for register
    static getRegister(req, res, next){
        res.render('users/register', {
            title: 'Register'
        })
    }
    
    //register with bcrypt
    static register(req, res, next){
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;
        let errors = false;
        if(email.length === 0 || email.length === 0){
            errors = true;
            req.flash('error', "Please enter username and password");
            res.render('users/register', {
                username: username,
                password: password,
                email: email
            })
        }
        if(!errors){
            bcrypt.hash(password, 10, function(err, hash){
                if(err) throw err;
                let formData = {
                    username: username,
                    email: email,
                    password: hash
                }
                connection.query('INSERT INTO users SET ?', formData, function(err, result){
                    if(err){
                        req.flash('error', err)
                        res.render('users/register', {
                            username: formData.username,
                            email: formData.email,
                            password: formData.password
                        })
                    }else{
                        req.flash('success', 'User successfully added');
                        res.redirect('/posts/users/register');
                    }
                })
            })
        }
    }

    //get route for login
    static getLogin(req, res, next){
        res.render('users/login', {
            title: 'Login'
        })
    }

    //login with bcrypt
    static login(req, res, next){
        let email = req.body.email;
        let password = req.body.password;
        let errors = false;
        if(email.length === 0 || email.length === 0){
            errors = true;
            // req.flash('error', "Please enter username and password");
            res.render('users/login', {
                email: email,
                password: password
            })
        }
        if(!errors){
            connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, rows, fields){
                if(err) throw err;
                if(rows.length <= 0){
                    req.flash('error', 'User not found with email = ' + email)
                    res.redirect('/posts/users/login')
                }else{
                    bcrypt.compare(password, rows[0].password, function(err, result){
                        if(err) throw err;
                        if(result){
                            const token = jwt.sign({email: rows[0].email}, secret, {expiresIn: '1h'});
                            req.session.token = token;
                            req.session.user = {id : rows[0].id, username: rows[0].username, email: rows[0].email}
                            req.flash('success', `User successfully logged in with id = ${rows[0].id}`);
                            res.redirect('/posts');
                        }else{
                            req.flash('error', 'Invalid password');
                            res.redirect('/posts/users/login');
                        }
                    })
                }
            })
        }
    }

    //logout
    static logout(req, res, next){
        req.session.destroy(function(err){
            if(err) throw err;
            res.redirect('/posts/users/login');
        })
    }
    
}

module.exports = usersController;