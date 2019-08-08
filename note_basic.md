# canvas 基础
1. 坐标以左上角为原点，横向为x, 纵向为y
2. 绘制路径：路径是闭合的
   beginPath  新建一条路径
   绘制命令指向路径，生成路径
   closePath 闭合路径 绘制命令指向上下文
3. 绘制命令有： fillRect stroke fill moveTo lineTo
arc(x, y, radius, startAngle, endAngle, anticlockwise)
以横轴X，顺时针计算弧度, 和anticlockwise的方向没有关联

4. fillStyle/stokeStyle 

5. canvas 渲染上下文 getContext('2D') Path2D
fillText

6. Path2D对象已可以在较新版本的浏览器中使用，用来缓存或记录绘画命令，这样你将能快速地回顾路径。
new Path2D();     // 空的Path对象
new Path2D(path); // 克隆Path对象
new Path2D(d);    // 从SVG建立Path对象

Path2D.addPath