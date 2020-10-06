/*****모듈 변수 설정*****/
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const mysqlStore= require('express-mysql-session')(session);



/*****Router 변수 설정*****/
const inquireRouter=require('./routes/Inquire_Router.js')
const joinRouter=require('./routes/join_Router.js');
const loginRouter=require('./routes/login_Router.js');
const reservateionRouter=require('./routes/reservation_RouterAndDB.js');
const myPageRouter=require('./routes/mypage_RouterAndDB.js');
const adminPageRouter=require('./routes/admingpage_RouterAndDB.js');

const app = express();
const sessionStore= new mysqlStore
({
  host: process.env.DB_IP,
  user: process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  port	:process.env.DB_PORT,
  database	:process.env.DB_DATABASE,
});

require('dotenv').config();
// view engine setup
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); 
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({  
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized:true, 
  store:sessionStore,
  cookie:{maxAge:6000000} ///1000분의 1초
}));

app.get('/',(req,res,next)=>{
  console.log(req.session.userId);
  return ((req.session.userId!==undefined)? res.render('index',{id:req.session.userId}) :res.render('index',{id:''}));
//db에 session이 저장되어있으면 서버 껐다켜도 세션 안풀림. 
});
app.use('/login',loginRouter);
app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{ //세션을 완전히 삭제, 완전히 세션을 삭제했으니 브라우저가 다음에 웹에 접근할 때 다시 세션 발급됨.
      console.log(`session destroy err: `,err);
      res.redirect('/');
    }); 
});
app.use('/join',joinRouter);
app.use('/inquire',inquireRouter);
app.use('/reservation',reservateionRouter);
app.use('/mypage',myPageRouter);
app.use('/adminpage',adminPageRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
