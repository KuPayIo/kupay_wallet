# input输入框

## props
```js
interface Props{
    input:string;//初始内容
    placeHolder:string;//提示文字
    disabled:boolean;//是否禁用
    clearable:boolean;//是否可清空 只对type="text"有效
    type:string;//text textarea
    rows:number;//输入框行数，只对 type="textarea" 有效
    prepend:string;//前置内容
    append:string;//后置内容
    style:Object;//样式
}
```

## 基础用法

```html
<components-input-input></components-input-input>
<components-input-input>{input:"这是初始内容"}</components-input-input>
<components-input-input>{placeHolder:"这是提示内容"}</components-input-input>
<components-input-input>{input:"这是初始内容",placeHolder:"这是提示内容"}</components-input-input>
```



## 禁用示例
```html
<components-input-input>{disabled:true}</components-input-input>
```

## 可清空 

- 目前点击后无法清空,待修复

```html
<components-input-input>{clearable:true}</components-input-input>
```

## 文本域

```html
<components-input-input>{type:"textarea"}</components-input-input>
```

## 可自适应文本高度的文本域

## 复合型输入框
```html
<components-input-input>{prepend:"http://"}</components-input-input>
```






## 事件

- ev-input-change 在输入框值改变时触发,回调参数 value   【英文和中文抛出事件次数有差异】
- ev-input-blur 输入框失去焦点
- ev-input-focus 输入框获得焦点
- ev-input-clear 点击清空按钮