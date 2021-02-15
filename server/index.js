const express = require('express');   //引入express模块
const app = express();        //创建express的实例
const router = express.Router()
const cors = require('cors')
const {login, folders, notes } = require('./api')(router)
app.use(cors())
app.use('/login', login)
app.use('/folders', folders)
app.use('/notes', notes)

app.listen(3000,function () {    //// 监听3000端口
    console.log('Server running at 3000 port');
})