# newcu-front-end

#### 准备工作
1. 安装node稳定版本（4.x）
 
2. 安装npm 3.x

3. 安装webpack

```
npm install webpack -g
```

4. 为了加快下载依赖包的速度，可以设置registry我们内部搭建的镜像地址（可选）：

```
npm config set registry http://10.21.1.10:4873
```
如果在非公司网络环境下，可能无法访问此服务器地址，你可以直接使用淘宝的源，这样比npm官方的快很多：
```
npm config set registry http://registry.npm.taobao.org/
```

#### 安装依赖
```sh
npm install
```


#### 编译es6
设置环境变量`NEO_ENV=dev`
然后执行命令：
```
webpack -d
```
> `webpack -d -w` -w 表示启用监听模式，可以在文件变化后，再次编译。

#### 启动服务
```
npm start
```

打开浏览器，访问 http://localhost:3000


#### 代码规范
本项目采用了Airbnb的[javascript书写规范](https://github.com/airbnb/javascript)，并结合实际情况，稍作修改。

代码检查：
`npm run eslint`


#### CSS浏览器兼容
引入`autoprefixer`工具，将css/less编译成兼容主流浏览器写法。
例如：
```css
display: flex;
```
将编译为：
```
display: -webkit-box;
display: -ms-flexbox;
display: flex;
```
>所以你开发的时候，基本不用考虑样式在各个主流浏览器下的兼容问题。
