开关

## 基础功能

### 标准开关
- 调用实例

        <components-switch-switch>{type:true,activeColor:"#13ce66",inactiveColor:"#ff4949"}</components-switch-switch>

- 参数介绍
    + 当前状态(type)--默认为false
    + 激活时颜色(activeColor)--默认为#409eff
    + 未激活时颜色(inactiveColor)--默认为#dcdfe6

- 事件
    + 在点击开关时，会向外部抛出事件(ev-switch-click)，外部接收即可，参数如下
        - 以前的状态(oldType)
        - 新的状态(newType)

## 注意事项

- 开关由于样式的限制，需外部引入css(components.css)进行处理