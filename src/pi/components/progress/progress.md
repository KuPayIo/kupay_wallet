进度条

## 基础功能

- 调用实例

        <components-progress-progress>{type:"out",value:0,color:"#8e71c7",status:"exception"}</components-progress-progress>

- 参数介绍
    + 类型(type)
        - 线形进度条 — 百分比外显(outer)
        - 线形进度条 — 百分比内显(inner)
        - 环形进度条(circle)
    + 进度值(value)--0~1的小数
    + 进度条颜色(color)--默认为(#409eff)
    + 状态(status)
        - 不填--标准显示
        - 完成(success)---进度条颜色将变为(#67c23a)
        - 异常(exception)---进度条颜色将变为(#f56c6c)


## 遇见的问题

svg的显示，有单独的组件ui-html进行支持