

# collapse输入框

## props
```js
interface CollapseItem{
    title:string;//标题
    htmlStr:string;//内容
}
interface Props{
    htmlStrList:Array<CollapseItem>;//html标签string
    accordion?:boolean;//是否以手风琴模式显示
}

```

```js
htmlStrList:[
    {
        title:"一致性 Consistency",
        htmlStr:`<div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>`,
    },
    {
        title:"反馈 Feedback",
        htmlStr:`<div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>`,
    },
    {
        title:"效率 Efficiency",
        htmlStr:`<div>简化流程：设计简洁直观的操作流程；</div>
        <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
        <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>`,
    },
    {
        title:"可控 Controllability",
        htmlStr:     
        `<div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>`
    }
]
```
## 基础用法

```html
<components-collapse-collapse>{htmlStrList:{{it1.htmlStrList}}}</components-collapse-collapse>
```



## 手风琴效果
```html
<components-collapse-collapse>{htmlStrList:{{it1.htmlStrList}},accordion:true}</components-collapse-collapse>
```







## 事件

- ev-collapse-change 点击时触发,如果是手风琴模式，参数 activeIndexs 类型为string，否则为array
