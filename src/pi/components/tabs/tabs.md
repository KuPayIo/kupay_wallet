页签

## 基础功能

- 调用实例

        <components-tabs-tabs>{list:{{it1.list}},activeNum:{{it1.activeNum}},type:"card",position:"right" } </components-tabs-tabs>
        it1.list = ["用户管理", "配置管理", "角色管理", "定时任务补偿"]

- 参数介绍
    + 显示数据(list)
    + 当前激活位置(activeNum)---默认为0
    + 显示类型(type)--默认为normal
        - 标准页签(normal)
        - 选项卡页签(card)
        - 卡片化页签(border_card)
    + 显示位置(position)--默认为top
        - 上方(top)
        - 右方(right)
        - 下方(bottom)
        - 左方(left)


- 该组件的目的是根据传入数据，显示不同类型的页签

## 遇见的问题

下方显示与上方显示无明显差异

