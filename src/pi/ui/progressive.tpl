{{% 要求it.widget 可选, 默认的数据组件名}}
{{% 要求it.arr 必须, el元素数据，如果el.widget则使用it.widget作为组件名}}
{{% 要求it.orientation 可选,提供滚动的方向，1为x方向，2为y方向，默认为2}}
{{% 要求it.initCount 可选, 初始显示多少数据，默认为10}}
{{% 要求it.addCount 可选, 滚动到头后增加多少数据，默认5}}
{{% 要求it.checkPixel 可选, 滚动差多少像素到头，如果为小数，表示使用宽高的百分比，默认0.5}}

{{:it = it || {"orientation":2, "arr":[], "min":10, "addCount":5, "checkPixel":0.5,"scrollEnd":false } }}

<div style="position: absolute; width:100%;height:100%;overflow-x: {{if it.orientation === 2}}hidden {{else}}auto {{end}}; overflow-y: {{if it.orientation === 2}}hidden {{else}}auto {{end}};" on-scroll="scroll">
{{let arr = it.arr.slice(it.showStart, it.showEnd)}}
{{for i, v of arr}}
<widget w-tag={{v.widget || it.widget}}>{{v}}</widget>
{{end}}

</div>
