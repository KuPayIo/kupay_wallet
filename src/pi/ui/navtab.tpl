{{% 要求it.cur可选提供当前选中的卡片位置，默认为原值，没有原值为0}}
{{% 要求it提供卡片数组，type:惰性加载0-隐藏显示切换，切换采用加载1-销毁模式，一次性加载2-隐藏显示切换。}}

{{:it = it || {cur:0, btn:"btn$", arr:[{tab:"selectnumber$", btn:{"text":"Abc1"}, cfg:{} },{tab:"selectnumber$", btn:{"text":"Abc2"}, cfg:{} }], old:{}, type:0 } }}

<div style="width:100%;height:100%">

<div w-class="tabs">
{{if it.type === 0}}
    {{for i, v of it.arr}}
        {{if i == it.cur}}
        <widget w-tag={{v.tab}} style="visibility:visible;z-index:2;position:absolute;width:100%;height:100%;">{{ v.cfg ? v.cfg : i}}</widget>
        {{elseif it.old[i]}}
        <widget w-tag={{v.tab}} style="visibility:hidden;z-index:1;position: absolute;width:100%;height:100%;">{{ v.cfg ? v.cfg : i}}</widget>
        {{end}}
    {{end}}
{{elseif it.type === 1}}
    <widget w-tag={{it.arr[it.cur]}} style="position:absolute;width:100%;height:100%;">{{it.cur}}</widget>
{{else}}
    {{for i, v of it.arr}}
        <widget w-tag={{v.tab}} style="visibility: {{i == it.cur ? 'visible' : 'hidden'}}; z-index:{{i == it.cur ? 2 : 1}}; position:absolute; width:100%;height:100%;">{{ v.cfg ? v.cfg : i}}</widget>
    {{end}}
{{end}}
</div>

<div btns="" w-class="btns" ev-btn="change">
{{for i, v of it.arr}}
    <widget w-tag={{it.btn}} style="display: inline-block;">{"cfg":{{v.btn}}, "e":{"cmd": {{i}} }, "select":{{i == it.cur}} }</widget>
{{end}}
</div>

</div>
