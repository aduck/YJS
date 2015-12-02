var Y={};
//基础函数
Y.Base={
	hasClass:function(elem,cname){
		var arr=elem.className.split(" ");
		for(var i=0;i<arr.length;i++){
			if(arr[i]==cname) return true;
		}
		return false;
	},
	isSupportOnload:function(script){
		var script=script||document.createElement("script");
		if("onload" in script){
			return true;
		}
		return false;
	}
}
//selector模块
Y.Selector=function(selector,context){
	var context=context||document;
	if(selector.slice(0,1)=="."){
		if(context.getElementsByClassName){
			return context.getElementsByClassName(selector.slice(1)); 
		}else{
			var all=context.getElementsByTagName("*"),
				elems=[];
			for(var i=0;i<all.length;i++){
				if(Y.Base.hasClass(all[i],selector.slice(1))){
					elems.push(all[i]);
				}
			}
			return elems;
		}			
	}else if(selector.slice(0,1)=="#"){
		return document.getElementById(selector.slice(1));
	}else{
		return context.getElementsByTagName(selector);
	}
};
//each模块
Y.Each=function(lists,callback,arg){
	var arg=arg||[];
	if(lists.length){
		for(var i=0;i<lists.length;i++){
			callback.apply(lists[i],arg);
		}
	}else{
		for(var i in lists){
			callback.apply(lists[i],arg);
		}
	}
};
//ajax模块
Y.Ajax={
	createXHR:function(){
		if(window.XMLHttpRequest){
			return new XMLHttpRequest();
		}else{
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	},
	start:function(options){
		var options=options||{},
			xhr=this.createXHR(),
			url=options.url||null,
			data=options.data||null,
			dataType=options.dataType||"json",
			method=options.method||"GET",
			callback=typeof options.callback=="function"?options.callback:function(){};
		if(method.toUpperCase()=="POST"){
			xhr.open(method,url,true);
			xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xhr.send(data);
		}else if(method.toUpperCase()=="GET"){
			url+="?"+data;
			xhr.open(method,url,true);
			xhr.send(null);
		}
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
					if(dataType=="json"){
						var result=JSON.parse(xhr.responseText);
					}else if(options.dataType=="xml"){
						var result=xhr.responseXML;
					}
					callback(result);
				}else{
					alert("加载出错:"+xhr.statusText);
				}
			}	
		}
	}
};
//loadScript模块
Y.LoadScript=function(url,callback){
	var script=document.createElement("script");
	if(Y.Base.isSupportOnload(script)){
		script.onload=function(){
			callback();
			document.getElementsByTagName("head")[0].removeChild(this);
		}
	}else{
		script.onreadystatechange=function(){
			if(script.readyState=="loaded"||script.readyState=="complete"){
				script.onreadystatechange = null;
				callback();
				document.getElementsByTagName("head")[0].removeChild(this);
			}
		}
	}
	script.src=url;
	document.getElementsByTagName("head")[0].appendChild(script);
};
//cookie管理模块
Y.Cookie={
	get:function(name){
		var cookie_name=encodeURIComponent(name)+"=",
			start=document.cookie.indexOf(cookie_name),
			cookie_value=null;
		if(start>-1){
			var end=document.cookie.indexOf(";",start);
			if(end>-1){
				cookie_value=document.cookie.slice(start+cookie_name.length,end);
			}else{
				cookie_value=document.cookie.slice(start+cookie_name.length);
			}
		}
		return decodeURIComponent(cookie_value);
	},
	set:function(options){
		var cookie_txt=encodeURIComponent(options.name)+"="+encodeURIComponent(options.value);
		cookie_txt+=(options.expires instanceof Date)?";expires="+options.expires.toGMTString():";expires="+new Date(new Date().getTime()+3600*1000).toGMTString();
		cookie_txt+=options.path?";path="+options.path:"";
		cookie_txt+=options.domain?";domain="+options.domain:"";
		document.cookie=cookie_txt;
	},
	unset:function(name,path,domain){
		this.set({
			name:name,
			value:"",
			expires:new Date(0)
		});
	}
};
//本地数据处理模块
Y.LocalData={
	userData:null,
	isLocalStorage:typeof localStorage=="undefined"?false:true,
	dataName:location.host,
	init:function(){
		if(!this.isLocalStorage){
			try{
				this.userData=document.createElement("input");
				this.userData.type="hidden";
				this.userData.style.display="none";
				this.userData.style.behavior="url(#default#userData)";
				document.body.appendChild(this.userData);
			}catch(e){
				return false;
			}
			return true;
		}
	},
	set:function(name,value){
		if(this.isLocalStorage){
			localStorage.setItem(name,value);
		}else if(this.init()){
			this.userData.load(this.dataName);
			this.userData.setAttribute(name,value);
			this.userData.save(this.dataName);
		}
	},
	get:function(key){
		if(this.isLocalStorage){
			return localStorage.getItem(key);
		}else if(this.init()){
			this.userData.load(this.dataName);
			return this.userData.getAttribute(key);
		}
		return null;
	},
	unset:function(key){
		if(this.isLocalStorage){
			localStorage.removeItem(key);
		}else if(this.init()){
			this.userData.load(this.dataName);
			this.userData.removeAttribute(key);
			this.userData.save(this.dataName);
		}
	}
};
//random随机模块
Y.Random=function(options){
	var options=options||{},
		range=options.range||null,
		args=options.args||null,
		num=options.num||1,
		common=options.common==false?false:true,
		allArr=[];
	if(typeof allArr.indexOf!="function"){
		Array.prototype.indexOf=function(x){
			for(var j=0;j<this.length;j++){
				if(this.j==x){
					return j;
				}
			}
			return -1;
		}
	};
	if(range){
		if(!common){
			do{
				var random=Math.round(Math.random()*(range[1]-range[0])+(range[0]));
				if(allArr.indexOf(random)==-1){
					allArr.push(random);	
				}
			}while(allArr.length<num);
		}else{
			for(var i=0;i<num;i++){
				var random=Math.round(Math.random()*(range[1]-range[0])+(range[0]));
				allArr.push(random);
			}
		}
		return allArr;
	}else if(args){
		if(!common){
			do{
				var random=Math.round(Math.random()*(args.length-1));
				if(allArr.indexOf(args[random])==-1){
					allArr.push(args[random]);
				}
			}while(allArr.length<num);
		}else{
			for(var i=0;i<num;i++){
				var random=Math.round(Math.random()*(args.length-1));
				allArr.push(args[random]);
			}
		}
		return allArr;
	}
};
//事件处理模块
Y.Event={
	bind:function(obj,type,callback){
		if(obj.addEventListener){
			return obj.addEventListener(type,callback,false);
		}else{
			try{
				Y_G_FUNC=function(){
					callback.apply(obj,arguments);
				};
				return obj.attachEvent("on"+type,Y_G_FUNC);
			}catch(ex){
				//
			}
		}
	},
	unbind:function(obj,type,callback){
		if(obj.removeEventListener){
			obj.removeEventListener(type,callback,false);
		}else{
			obj.detachEvent("on"+type,Y_G_FUNC);
		}
	},
	on:function(obj,type,callback,selector){
		if(!selector){
			return this.bind(obj,type,callback);
		}else{
			var elem=Y.Selector(selector,obj),
				self=this;
			Y.Each(elem,function(){
				return self.bind(this,type,callback);
			});
		}
	}
};
//表单处理模块
Y.Form={
	//
}