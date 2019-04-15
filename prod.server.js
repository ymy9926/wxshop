var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.PORT;

var app = express();

var router = express.Router();

router.get('/', function (req, res, next) {
    req.url = '/index.html';
    next();
});

app.use(router);

var appData = require('./data.json')//加载本地数据文件
var seller = appData.seller;//获取对应的本地数据
var goods = appData.goods;
var ratings = appData.ratings;
var apiRoutes = express.Router();


app.get('/api/seller', (req, res) => {
    res.json({
        errno: 0,
        data: seller
    })//接口返回json数据，上面配置的数据seller就赋值给data请求后调用
});
app.get('/api/goods', (req, res) => {
    res.json({
        errno: 0,
        data: goods
    })
});
app.get('/api/ratings', (req, res) => {
    res.json({
        errno: 0,
        data: ratings
    })
});

app.use('/api', apiRoutes)//通过路由请求数据

app.use(express.static('./dist'));

app.listen(9000, function (err, stats) {
    if (err) {
        console.log(err);
        return;
    }
    // process.stdout.write(stats.toString({
    //     colors: true,
    //     modules: false,
    //     children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
    //     chunks: false,
    //     chunkModules: false
    // }) + '\n\n')

    // if (stats.hasErrors()) {
    //     console.log(chalk.red('  Build failed with errors.\n'))
    //     process.exit(1)
    // }

    // console.log(chalk.cyan('  Build complete.\n'))
    // console.log(chalk.yellow(
    //     '  Tip: built files are meant to be served over an HTTP server.\n' +
    //     '  Opening index.html over file:// won\'t work.\n'
    // ))
    console.log('start....');
});