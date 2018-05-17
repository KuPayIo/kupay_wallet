步骤条

## 基础功能

- 调用实例

        <components-steps-steps>{type:"vertical",list:[ {status:"success",title:"已完成",description:"我是描述1"} ,...]}</components-steps-steps>

- 参数介绍
    + 类型(type)
        - 横向显示(horizontal)
        - 纵向显示(vertical)
    + 显示数据(list)
        - 状态(status)
            + 已完成(success)
            + 进行中(process)
            + 等待中(wait)
        - 标题(title)
        - 描述(description)--可不填

- 该组件的目的是根据传入数据，显示不同类型不同状态下步骤信息

## 遇见的问题