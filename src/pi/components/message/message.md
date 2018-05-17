消息提示

## 基础功能

### 提示框

- 调用实例

        ts代码中直接打开消息窗口即可，3秒后消失，显示在界面最上部
        popNew("components-message-message", { type: "success", content: "成功提示的文案", center: true })

- 参数介绍
    + 类型(type)
        - 成功(outer)--颜色#67c23a
        - 警告(warn)--颜色#e6a23c
        - 提示(notice)--颜色#909399
        - 错误(error)--颜色#f56c6c
    + 文本内容(content)
    + 是否居中显示(center)--默认为(false)
- 显示在pop_tip层，不接受任何事件

### 确认提示框

- 调用实例

        ts代码中直接打开窗口即可，手动关闭
        popNew("components-message-messagebox", { type: "confirm", title: "确认消息弹框", content: "错误提示的文案" }, ok?, cancel?)

- 参数介绍
    + 类型(type)
        - 确认框(alert)
        - 确认取消框(confirm)
        - 确认取消输入框(prompt)
    + 标题(title)
    + 文本内容(content)
    + 确认回掉(ok)--可选
        - confirm类型下，回掉参数为输入数据
    + 取消回掉(cancel)--可选
- 显示在top层，遮挡全屏，全屏接受点击事件

### 通知

- 调用实例

        ts代码中直接打开窗口即可，可控制手动关闭或3秒后自动关闭
        popNew("components-message-notification", { title: "提示", content: "手动关闭提交内容弹框", manuallyClose: true })

- 参数介绍
    + 标题(title)
    + 文本内容(content)
    + 手动关闭(manuallyClose)--默认为false
- 显示在download层，外部不接受事件，内部接受事件

## 遇见的问题

