var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
const dotenv = require('dotenv');

// 全局日志中间件
const logMiddleware = require('./middlewares/logMiddleware');
app.use(logMiddleware);
// 添加登录状态拦截中间件
const authMiddleware = require('./middlewares/authMiddleware');
app.use(authMiddleware);
//添加权限状态拦截中间件
const permissionMiddleware = require('./middlewares/permissionMiddleware');
app.use(permissionMiddleware);


// 加载 .env 文件中的环境变量
dotenv.config();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//this part is about apis
const apiRoutes = require('./api');
// for users router
app.use('/api/users', apiRoutes.usersRouter);
// for roles router
app.use('/api/roles', apiRoutes.rolesRouter);
// for items router
app.use('/api/items', apiRoutes.itemsRouter);
// for products router
app.use('/api/products', apiRoutes.productsRouter);
// for publish router
app.use('/api/publishs', apiRoutes.publishRouter);
// for massages router
app.use('/api/massages', apiRoutes.massagesRouter);
// for comments router
app.use('/api/comments', apiRoutes.commentsRouter);




var productRouter = require('./routes/product');
var corporationRouter = require('./routes/corporation');
var contactusRouter = require('./routes/contactus');
var detailRouter = require('./routes/detail');
var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');
var publishRouter = require('./routes/publish');
var usersRouter = require('./routes/users');
var servererrorRouter = require('./routes/servererror');
var clienterrorRouter = require('./routes/clienterror');
var editproductRouter = require('./routes/editproduct');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// 配置静态文件服务，将 public 目录作为静态资源根目录
app.use(express.static(path.join(__dirname, 'public')));

app.use('/product', productRouter);
app.use('/', corporationRouter);
app.use('/publish', publishRouter);
app.use('/corporation', corporationRouter);
app.use('/contactus', contactusRouter);
app.use('/detail', detailRouter);
app.use('/admin', adminRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/servererror', servererrorRouter);
app.use('/clienterror', clienterrorRouter);
app.use('/editproduct', editproductRouter);

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
