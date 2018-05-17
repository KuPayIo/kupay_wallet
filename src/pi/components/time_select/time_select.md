# timeSelect时间选择器

## props
```js
interface Props{
    start:string;//开始时间 09:00
    step:string;//间隔时间 00:30
    end:string;//结束时间 18:00
}
```

## 基础用法

```html
 <components-time_select-time_select>{start:"08:30",end:"18:30",step:"01:16"}</components-time_select-time_select>
```



## 事件

- ev-input-change 在输入框值改变时触发,回调参数 value   【英文和中文抛出事件次数有差异】
- ev-input-blur 输入框失去焦点
- ev-input-focus 输入框获得焦点
- ev-input-select 点击下拉选中后触发