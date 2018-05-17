数字选择

## 基础功能

- 调用实例

        <components-selectcount-selectcount>{value:{{it.value}},min:{{it.min}},max:{{it.max}}}</components-selectcount-selectcount>

- 参数介绍
    + 初始值(value)--默认为0
    + 最小值(min)--默认为0
    + 最大值(max)--默认为100

- 该组件实现了显示不同数据，内部引用了input组件及按钮的点击与长按

- 事件
    + value改变时抛出ev-selectcount事件，外部接收即可，参数如下
        - 改变后的值(value)

## 遇见的问题

