# Radio 单选框

- 需要配合RadioGroup使用,不要单独使用

## 使用方法
```html
<components-radio-radio>{labelIndex:0,text:"测试文本1",checkedIndex:0}</components-radio-radio>
```
## props属性

```js
interface Props {
    labelIndex: number;//当前单选框下标
    text:string;//Radio显示文本
    checkedIndex:number;//选中的下标
    disabled:boolean;//是否禁用
}
```

## 事件

- 从未选中到选择状态会向外抛出事件(ev-radio-change)

### 事件参数

```js
interface params{
    checkedIndex:number;//选中的下标
}
```


# RadioGroup 单选框组

## 使用方法
```html
<components-radio-radioGroup>{checkedIndex:0,radioList:[{text:"测试文本1"},{text:"测试文本2"},{text:"测试文本3"}]}</components-radio-radioGroup>
```

## props属性
```js
interface radioObj {
    text:string;//Radio显示文本
    disabled:boolean;//是否禁用
}

interface Props {
    checkedIndex:number;//默认选中的下标
    radioList:radioObj[];//单选框数组列表
}

```


## 事件

- 从未选中到选择状态会向外抛出事件(ev-radio-change)

### 事件参数

```js
interface params{
    checkedIndex:number;//选中的下标
}
```