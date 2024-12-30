const express = require('express');
const path = require('path');
const app = express();
const port = 3080;

// 设置静态文件目录
app.use(express.static('public'));

// 为所有请求设置响应头
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
