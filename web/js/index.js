window.onload = function(){
	//初始化聊天程序
	var chat = new Chat();
	chat.init();
};

//定义chat类
var Chat = function(){
	this.socket = null;
};

//给chat类增加方法
Chat.prototype = {
	init: function(){
		//初始化程序
		var that = this;
		//建立socket连接
		this.socket = io.connect();
		//监听connet事件
		this.socket.on('connect',function(){
			//连接服务器并显示登录界面
			document.getElementById('info').textContent = '取个名字吧！';
			document.getElementById('login_wrapper').style.display ='block';
			document.getElementById('user').focus();
		});
		//昵称按钮逻辑
		document.getElementById('login_btn').addEventListener('click',function(){
			var user = document.getElementById('user').value;
			//判断昵称是否为空
			if(user.trim().length !=0){
				//激活login事件并将昵称发送到服务器
				that.socket.emit('login',user);
			}else{
				alert("昵称不能为空！");
				//昵称输入框重新获得焦点
				document.getElementById('login').focus;
			};
		},false);
		//发送按钮逻辑
		document.getElementById('send').addEventListener('click',function(){
			//获取输入的信息并清空
			var MsgTextArea = document.getElementById('msg'),
				getMsg = MsgTextArea.value;
			MsgTextArea.value='';
			//重新获取输入框焦点
			MsgTextArea.focus();
			//判断输入消息是否为空
			if(getMsg.trim().length != 0){
				//把消息传给后端
				that.socket.emit('postMsg',getMsg);
				//将消息显示到窗口中
				that.displayMyMsg('我',getMsg);
			};
		},false);
		//输入消息时监听按键事件
		document.getElementById('msg').addEventListener('keyup',function(e){

			if(e.keyCode == 13){
				var MsgTextArea = document.getElementById('msg'),
				getMsg = MsgTextArea.value;
				MsgTextArea.value='';
				MsgTextArea.focus();
				if(getMsg.trim().length != 0){
					//把消息传给后端
					that.socket.emit('postMsg',getMsg);
					//将消息显示到窗口中
					that.displayMyMsg('我',getMsg);
				};
			};
		},false);
		//接收后端发出的昵称已存在信息
		this.socket.on('userExisted',function(){
			document.getElementById('info').textContent = '昵称已存在，请重新输入';
			//昵称已存在提示
		});
		this.socket.on('loginSuccess',function(){
			//隐藏登录界面
			document.getElementById('enter_wrapper').style.display = 'none';
			//消息输入框获取焦点
			document.getElementById('msg').focus();
		});
		//接收后端发出的系统消息
		this.socket.on('system',function(user,userNum,type){
			//判断用户是进入聊天还是离开
			var message = user + (type == 'login'? '加入会议' : '退出会议');
			//var p = document.createElement('p');
			//显示用户加入或退出信息
			//p.textContent = message;
			//document.getElementById('history_msg').appendChild(p);
			//指定系统消息显示为红色
			that.displaySysMsg('系统消息:',message,'#fff');
			//显示在线人数
			document.getElementById('status').textContent = userNum + '个人正在进行会议';

		});
		//接受后端发出的新消息
		this.socket.on('newMsg',function(user,msg){
			that.displayNewMsg(user,msg);
		});
	},
	//添加一个显示消息的方法，默认参数为昵称，信息，信息颜色
	displayNewMsg:function(user,msg,color){
		var container = document.getElementById('history_msg'),
			msgDisplay = document.createElement('p'),
			date = new Date().toTimeString().substr(0,8);
		msgDisplay.style.color = color || '#000';
		msgDisplay.innerHTML = user + '<span class="timespan">(' +
		date + '):</span>' + msg;
		container.appendChild(msgDisplay);
		container.scrollTop = container.scrollHeight;
	},
	//添加一个显示自己发出的消息的方法
	displayMyMsg:function(user,msg,color){
		var container = document.getElementById('history_msg'),
			msgDisplay = document.createElement('p'),
			date = new Date().toTimeString().substr(0,8);
		msgDisplay.style.color = color || '#87CEFF';
		//msgDisplay.className = 'myMsg';
		msgDisplay.style.textAlign = 'right';
		msgDisplay.innerHTML = user + '<span class="timespan">(' +
		date + '):</span>' + msg;
		container.appendChild(msgDisplay);
		container.scrollTop = container.scrollHeight;
	},
	//添加一个发出系统消息的方法
	displaySysMsg:function(user,msg,color){
		var container = document.getElementById('history_msg'),
			msgDisplay = document.createElement('p'),
			date = new Date().toTimeString().substr(0,8);
		msgDisplay.style.color = color || '#FFF';
		msgDisplay.style.textAlign = 'center';
		msgDisplay.style.backgroundColor = '#C4C4C4';
		msgDisplay.style.fontSize = '10px';
		msgDisplay.innerHTML = user + '<span class="timespan">(' +
		date + '):</span>' + msg;
		container.appendChild(msgDisplay);
		container.scrollTop = container.scrollHeight;
	}
}