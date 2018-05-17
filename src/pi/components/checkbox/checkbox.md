选择框

## 基础功能

### 标准选择框
- 调用实例
    
        <components-checkbox-checkbox>{type:"true",text:"选中"}</components-checkbox-checkbox>

- 通过类型控制选择框初始状态
    + 选中状态(true)
    + 未选中状态(false)
    + 禁用状态(disabled)
    + 半选择状态(indeterminate)--通常仅在选择框组中使用
- 事件
    + 在点击选择框时，会向外部抛出事件(ev-checkbox-click)，外部接收即可，参数如下
        - 以前的状态(oldType)
        - 新的状态(newType)
        - 位置(index)--仅在选择框组中有值

### 选择框组
- 调用实例

        <components-checkbox-checkboxGroup>{chooseAll:"全选",list:[...],min:2,max:4}</components-checkbox-checkboxGroup>

- 参数介绍
    + 是否显示全选(chooseAll)
    + 选择框组数据(list)--每一条数据都是一个标准的选择框
    + 最小数量限制(min)
    + 最大数量限制(max)

- 功能
    + 可通过全选控制全选或全不选
    + 可通过设置min与max控制选择数量

- 事件
    + 在点击全选框时，会向外部抛出事件(ev-checkbox-all-click)，外部接收即可，参数如下
        - 以前的状态(oldType)
        - 新的状态(newType)

## 注意事项

- 选择框由于样式的限制，需外部引入css(components.css)进行处理
- 选择框组中，选择所有与数理控制原则上不共存，因为其表现形式有差异
