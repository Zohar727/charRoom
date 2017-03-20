// //引入http模块   这是最基本的写法
// var http = require('http'),
// 	//创建一个服务器
// 	server = http.createServer(function(req,res){
// 		res.writeHead(200,{
// 			'Content-Type':'text/html'
// 		});
// 		res.write('<h1>hello world!</h1>');//使用express返回html文件
// 		res.end();
// 	});
// //监听8080端口
// server.listen(8080);
// console.log("server start!");
// -----------------
// 引入express模块
var express = require('express'),
	app = express(),
	server = require('http').createServer(app);
	//引入socket.io模块并绑定到服务器
	io = require('socket.io').listen(server);
	//新建一个数组保存所有昵称
	users = [];
	//指定返回静态页面的位置
app.use('/',express.static(__dirname + '/web'));
server.listen(8080);
console.log("server started successfully!");

//socket
io.on('connection',function(socket){
	//设置昵称
	socket.on('login',function(user){
		//查找是否有重复的昵称
		if(users.indexOf(user) > -1){
			socket.emit('userExisted');
		}else{
			socket.userIndex = users.length;
			socket.user = user;
			users.push(user);
			//向前端发送登录成功的消息
			socket.emit('loginSuccess');
			//向连接服务器的所有用户发送新用户加入聊天提示
			//传递3个参数，用户名，user.length用于表示在线用户数
			//login表示用户当前状态是加入聊天
			io.sockets.emit('system',user,users.length,'login');
		};
	});
	//用户退出聊天事件
	socket.on('disconnect',function(){
		//将断开连接的用户从users数组中删除
		users.splice(socket.userIndex,1);
		//socket.broadcast用于通知出自己以外的所有人
		socket.broadcast.emit('system',socket.user,users.length,'exit');
	});
	//用户发送消息事件
	socket.on('postMsg',function(msg){
		socket.broadcast.emit('newMsg',socket.user,msg);
	});
})