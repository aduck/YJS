// 观察者模型
function Observer(){
	this._callbacks={};  // 为每一个观察者分配事件容器
}
Observer.prototype.addEvent=function(type,callback){
	var self=this;
	function pusher(key,item){
		if(typeof self._callbacks[key]==="undefined"){
			self._callbacks[key]=[item];
		}else{
			self._callbacks[key].push(item);
		}
	}
	if(typeof callback=="function"){
		pusher(type,callback);
	}else if(callback instanceof Array){
		var i,len=callback.length;
		for(i=0;i<len;i++){
			pusher(type,callback[i]);
		}
	}
	return this;
}
Observer.prototype.fireEvents=function(type,arg){
	var callbacks=this._callbacks[type]||[],
		i,len=callbacks.length;
	for(i=0;i<len;i++){
		callbacks[i].call(this,arg);
	}
	return this;
}
Observer.prototype.removeEvents=function(type){
	delete this._callbacks[type];
	return this;
}
