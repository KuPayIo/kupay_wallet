<div w-class="itemGroup">
    {{for ind,val of it.list}}
    <div w-class="item" on-tap="changeSelect({{ind}})">
        <span style="flex: 1">{{val.name}}</span>
        {{if it1.selected == ind}}
        <img src="../../../res/image/16.png" style="width: 40px;height: 40px;"/>
        {{end}}
    </div>
    {{end}}

</div>