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
 *    4.将获取到新的 值赋予 dragTo（）上
 */
// 判断浏览器的对css3 transform的兼容性
function optCss(){
	var transform = '',
	transformArr = ['transform','WebkitTransform','MsTransform','OTransform'],
	element = document.createElement('div');
	for(var i = 0 ; i< transformArr.length ; i++){
		transform =  transformArr[i];
		if(typeof element.style.transform != 'undefined'){
			return transform;
		}
	}
	return false
}
// 获取元素的样式  currentStyle['attr']判断IE浏览器 getComputedStyle(elem,null)[attr]W3C 标准
function getElemStyle(elem,attr){
	return elem.currentStyle?elem.currentStye[attr]:getComputedStyle(elem,null)[attr];
}
// 获取event事件的兼容性
function getEvent(e){
	return e || window.e;
}
// 获取鼠标的位置
function getMousePosition(e){
	var ev = getEvent(e);
	if(ev.pageX){
		return {x:ev.pageX,y:ev.pageY}
	}
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop - document.body.clientTop
	}
}
// 判断移动方式  是tansform 还是position 
// 获取 要拖拽元素的初始位置
function dragStart(elem){
	var pos = {x:0,y:0},trans = optCss();
	if(trans){
		if(getElemStyle(elem,trans)!='none'){
			var transformStr = getElemStyle(elem,trans);
			var transArr = transformStr.match(/-?\d+/g);
			pos.x = parseInt(transArr[4].trim());
			pos.y = parseInt(transArr[5].trim());
		}else{
			elem.style[trans] = 'translate('+pos.x+'px,'+pos.y+'px)';
		}
	}else{
		if(getElemStyle(elem,'position')){
			pos.x = parseInt(getElemStyle(elem,'left'));
			pos.y = parseInt(getElemStyle(elem,'left'));
		}else{
			elem.style.position = 'relative';
			elem.style.left = pos.x+'px';
			elem.style.top = pos.y+'px';
		}
	}
	return pos;
}
// 设置元素拖动后的位置
function dragTo(elem,obj){
	if(optCss()){
		elem.style.transform = 'translate('+obj.x+'px,'+obj.y+'px)';
	}else{
		elem.style.left = obj.x+'px';
		elem.style.top = obj.y+'px';
	}
}









