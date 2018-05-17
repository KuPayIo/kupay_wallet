# loading加载

## props
```js
interface Props {
    text:string;//加载文本
}
```

## 全局loading

- 全局loading需要通过popNew()来实例化loading组件
- 并在合适的时候调用close的callback来关闭loading组件

```js
let close = popNew("components-loading-loading",{});
setTimeout(()=>{
    close.callback(close.widget);
},3000);
```

## 局部loading

- 局部loading需要动态设置组件是否显示
- 父节点positon不能为static

```html
<div on-click="localClick" style="height:500px;width:500px;margin:200px auto;background-color:#fff;position:relative;">
        局部loading
        {{if it1.showLocalLoading}}
        <components-loading-loading>{text:"局部加载"}</components-loading-loading>
        {{end}}
</div>
```