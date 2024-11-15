const createError = require('http-errors');

const express = require('express');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const router = require('./routes');
const { httpErrorHandler, passport } = require('./middlewares');

const app = express();

const corsOptions = {
  origin: 'https://real-time-large-dataset-dashboard.vercel.app',
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());

app.get('/', async(req,res) => {
  res.json("hello")
})

router(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl)
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => httpErrorHandler(err, req, res, next));

// app.listen(4000,()=>{
//   console.log('Serving running on port 4000')
// })

module.exports = app;
