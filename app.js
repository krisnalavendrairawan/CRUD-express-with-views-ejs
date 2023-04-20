const createError = require('http-errors');
const express = require('express');
const path  = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//library
const flash = require('express-flash');
const session = require('express-session');

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const app = express();
const port = 3000;

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    cookie : {
        maxAge : 60000
    }, 
    store : new session.MemoryStore,
    saveUninitialized : true,
    resave : 'true',
    secret : 'secret'
}))


app.use(flash());
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/posts', postsRouter);

//catch 404 and forward to error handler
app.use(function(err, req, res, next){
    //set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    //render the error page
    res.status(err.status || 500);
    res.render('error');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
module.exports = app;
