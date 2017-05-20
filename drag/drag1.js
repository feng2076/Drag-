;(function(window){
// 通过闭包自执行函数 实现块级作用域 避免变量污染
/**
 * 拖拽的两种实现方式：
 * 	1.position：改变其left或者right的值；（在性能上有一点问题）
 * 	2.css3transfrom属性 通过改变translate的值；（在浏览器的兼容性上有带提高）
 *
 * 拖拽事件实现的原理：
 * 	1.通过 mousedown 事件获取到鼠标第一次在页面中的位置和要移动元素的初始位置；
 * 						-------          mouseX                 ---------        elemX
 * 	2.通过 mousemove 事件获取到鼠标在页面滑动时不断改变的鼠标位置
 * 									--------   currentX
 * 	3.将 鼠标滑动过程中不断改变的位置减去鼠标的初始位置加加上元素初始位置
 * 					---------  currentX - mouseX + elemX  ----------
 *    4.将获取到新的 值赋予 dragStart（）上
 */
// 判断浏览器是否支持 css3属性
var css = supportCss();
// 防止命明冲突  提前保留全局的Drag变量 通过returnDrag()来释放变量
var _Drag = window.Drag;
// 全局注册 window.Drag
var Drag = window.Drag = function(selector){
	return new Drag.prototype.init(selector);
}
// 拖拽方法实现
Drag.prototype = {
	constructor:Drag,
	init:function(selector){
		//  Drag 初始化方法实现  实现无New 方法 模仿jq方法
		this.elem = '';
		if(typeof selector == 'string'){
			// 这个地方还可以做到 #id 或者 .class 等去选择我们要移动的元素
			this.elem = document.getElementById(selector);
			// console.log(this.getStatusElem());
			this.dragStart();
		}else{
			// 不是我们要的 选择器对象 我们实现容错
			console.error('is not my need param');
		}
	},
	returnDrag:function(){
		// 将Drag对象释放出来
		window.Drag = _Drag;
	},
	getStatusElem:function(){
		// 获取拖动对象的初始位置
		var pos = {x:0,y:0};
		if(css){
			var styleStr = getStyle(this.elem,css);
			if(styleStr!='none'){
				var styleArr = styleStr.match(/-?\d+/g);
				pos.x = parseInt(styleArr[4]);
				pos.y = parseInt(styleArr[5]);
			}else{
				this.elem.style[css] = 'translate('+pos.x+'px,'+pos.y+'px)';
			}
		}else{
			pos.x = getStyle(this.elem,'left')?parseInt(getStyle(this.elem,'left')):0;
			pos.y = getStyle(this.elem,'top')?parseInt(getStyle(this.elem,'top')):0;
		}
		return pos;
	},
	setElemStatus:function(obj){
		// 根据传过来的 参数设置元素的位置
		if(css){
			this.elem.style[css] = 'translate('+obj.x+'px,'+obj.y+'px)'
		}else{
			this.elem.left = obj.x+'px';
			this.elem.right = obj.y+'px';
		}
	},
	dragStart:function(){
		// 绘制每次div移动过程的函数
		var _this = this;
		this.elem.addEventListener('mousedown',function(e){
			var mouseStatus = getMousePosition(e),elemStatus = _this.getStatusElem();
			var mouseX = mouseStatus.x,mouseY = mouseStatus.y,elemX = elemStatus.x,elemY = elemStatus.y;
			document.addEventListener('mousemove',go,false);
			document.addEventListener('mouseup',end,false); 
			function go(e){
				var mouseCurrent = getMousePosition(e);
				var currentX = mouseCurrent.x,currentY = mouseCurrent.y;
				var obj = {
					x:currentX - mouseX + elemX,
					y:currentY - mouseY + elemY
				};
				_this.setElemStatus(obj);
			}
			function end(e){
				document.removeEventListener('mousemove',go);
				document.removeEventListener('mouseup',end);
			}
		})

	}
}
Drag.prototype.init.prototype = Drag.prototype;
/**
 * 模块内的 独立函数服务域模块本身
 *  该方法是我们作用域独立的函数不和外界交互 单独写；
 */
// 判断浏览器是否支持transform属性
function supportCss(){
	var tranArr = ['transform','WebkitTransform','MsTransform','OTransform'],
	 elemStyle = document.createElement('div');
	for(var i = 0;i<tranArr.length;i++){
		var attr = tranArr[i]
		if(elemStyle.style[attr] != 'undefined'){
			return attr;
		}
	}
	return false
}
// 获取元素的样式
function getStyle(elem,attr){
	return elem.currentStyle?elem.currentStyle[attr]:getComputedStyle(elem,null)[attr];
}
// 获取鼠标在页面的位置
function getMousePosition(e){
	var e = e || window.e;
	if(e.pageX){
		return {
			x:e.pageX,
			y:e.pageY
		}
	}return{
		x:e.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:e.clientY + document.body.scrollTop - document.body.clientTop
	}
}
})(window)