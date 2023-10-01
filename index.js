if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const { app, express } = require("./server");
const cors = require('cors')
//   const dbUrl = process.env.DB_URL

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

app.use(cors())


const BlogRouter = require('./route/blog')

app.use('/', BlogRouter)
