# input_autocomplete带输入建议输入框 

## props
```js
interface TipList{
    value:string;//匹配文字
}

interface Props {
    tipList:Array<TipList>;//提示列表
}
```

## 基础用法
```html
<components-input_autocomplete-input_autocomplete>{tipList:[{ "value": "三全鲜食（北新泾店）}]}</components-input_autocomplete-input_autocomplete>
```


## 事件
- ev-input-change 在输入框值改变时触发,回调参数 value   【英文和中文抛出事件次数有差异】
- ev-input-blur 输入框失去焦点
- ev-input-focus 输入框获得焦点
- ev-input-select 点击下拉选中后触发