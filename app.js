const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const mysqlStore= require('express-mysql-session')(session);
const dbOption = require('./models/Option_DB.js');

const inquireRouter=require('./routes/Inquire_Router.js')
const joinRouter=require('./routes/join_Router.js');
const loginRouter=require('./routes/login_Router.js');
const reservateionRouter=require('./routes/reservation_Router.js');

const app = express();
const sessionStore= new mysqlStore(dbOption);

require('dotenv').config();
// view engine setup
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); //?
app.use(express.static(path.join(__dirname, 'public')));


//session 미들웨어를 사용함으로써 req.session을 하면 session값을 불러올 수 있음. 즉 요청에 session 객체를 요청에 추가해준다 
//만약 session미들웨어를 사용하지 않는다면 요청.session 값은 undefined임
app.use(session({  // app.use로 설정하면 사용자 요청이 있을 때 마다 이 코드를 실행(너무 당연한데)
  secret: process.env.SESSION_SECRET, //다른사람에게 노출되서는 안됨, 자신만의 문자, 시크릿 키
              //필수항목 , 쿠키파서의 비밀키와 같은 역할을 하며, 안전하게 쿠키를 전송하려면 쿠키에 서명을 추가해야하고, 쿠키를 서명하는데 secret의 값이 필요하다. cookie-parserㅇ의 secret과 같게 설정해야한다.
  resave: false, // resave가 false면 세션데이터가 변경되기 전까지 session값을 다시 저장하지 않는다. 만약 resave가 true면 세션데이터가 변경되건 안되건 요청이들어오면  계속 저장한다.
                //resave: 요청이 왔을 때 세션에 수정사항이 생기지 않더라도 세션을 다시 저장할지에 대한 설정
  saveUninitialized:true, //세션이 필요하기 전까지 세션을 구동하지 않는다.(true)  세션이 필요하건 안필요하건 무조건 구동시킨다(false)(서버에 큰부담음줌)
                  //세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 설정(보통 방문자 추적할때 사용)
  
  store:sessionStore,
  cookie:{maxAge:6000000} ///1000분의 1초
}));

app.get('/',(req,res,next)=>{
  console.log(req.session.userName);
  return ((req.session.userName!==undefined)? res.render('index',{id:req.session.userName}) :res.render('index',{id:''}));
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



// catch 404 and forward to error handler
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
