滑块

## 基础功能

- 调用实例

        <components-slider-slider>{value:0,min:0,max:1,precision:2,step:3,showValue:true}</components-slider-slider>

- 参数介绍
    + 初始值(value)--默认为0
    + 最小值(min)--默认为0
    + 最大值(max)--默认为100
    + 保留几位小数(precision)--默认为0
    + 滑动间隔步数(step)--默认为1
    + 显示数量(showValue)--默认为false 

- 事件
    + value改变时抛出ev-slider-change事件，外部接收即可，参数如下
        - 改变后的值(value)

## 遇见的问题

在代码中动态绑定事件时，不能使用window.addEventListener('mousemove', this.onDragging);需要addEvent(window, 'mousemove', this, true)，其中addEvent是widget/scroller/dom中提供的函数

在代码中动态绑定事件时，不建议直接绑定对应处理函数，这样将导致this的指向异常。可通过绑定this对象，并在widget中声明handleEvent函数进行中转，从而达到调用对应处理函数的目的

为了实现鼠标在任意位置都能触发move与up事件，通常在触发down事件后，将对应事件动态的绑定在window上

滑动间隔步数与保留几位小数不建议同时使用，其表现上控制起来较难