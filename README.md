# Drag-
面向过程 和面向对象的 拖拽实现方法
https://github.com/myprelude/Drag-.git

drag.js是面向过程 ----------------drag1.js是面向过程

#实现原理
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
 *    4.将获取到新的 值赋予 更新移动元素的函数上
 */
