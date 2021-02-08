const express = require('express');

const app = express()

const bodyParser = require('body-parser');
const userRouter = require('./router/user');
const PracticeRouter = require('./router/practice')
const GlobalErrorController = require('./controller/GlobalErrorController');
const AppError = require('./utils/AppError')
const path = require('path')

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors')

// / Set security HTTP headers
app.use(helmet());

// app.use(cors({
//     origin: 'http://localhost:8080',
//     optionsSuccessStatus: 200 ,// For legacy browser support
//     methods: "GET, PUT"
// }))

// const { model } = require('mongoose');
process.on('uncaughtException',err => {
    console.log('Uncaught Exception occurs');
    console.log(err.message,err.name);
    process.exit(1);
})

// Limit requests from same API
const limiter = rateLimit({
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
  });
  app.use('/api', limiter);


app.use(bodyParser.json({limit:'10kb'}));



// Data sanitization against NoSQL query injection: it removes all the $ operator from body params etc
app.use(mongoSanitize());


// Data sanitization against XSS
app.use(xss()); 

// Prevent parameter pollution:authorization ko last ma x :paxi afulai k chainxa tei anusar milaune
app.use(
    hpp({
      whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
      ]
    })
  );


app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/users',userRouter)//mounting a router
app.use('/api/v1/hospital',PracticeRouter)

app.use('*',(req,res,next )=> {
   next(new AppError('this route is not defined',400))
})


app.use(GlobalErrorController)





process.on('unhandledRejection',(err) => {
    console.log(err.name,err.message);
    process.exit(1);
});



module.exports = app;