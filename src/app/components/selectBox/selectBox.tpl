<div w-class="selectBox">
    <div w-class="basicTop" on-tap="showList">
        {{let item = it.list[it.selected]}}
        {{let itemName = item.name === 'KT' ? it.ktShow : item.name}}
        <img src={{item.img}} style="width: 50px;height: 50px;"/>
        <span w-class="prepend">{{itemName}}</span>
        <span w-class="append">{{item.num}}</span>
        <img src="../../res/image/15.png" style="width: 40px;height: 40px;"/>
    </div>

    {{if it.showList && !it.forceHide}}
    <div w-class="new-code-bg">
        {{for ind,val of it.list}}
        {{let valName = val.name === 'KT' ? it.ktShow : val.name}}
        <div w-class="new-code" on-tap="changeSelect(e,{{ind}})">
            <img src={{val.img}} style="width: 50px;height: 50px;"/>
            <span w-class="prepend">{{valName}}</span>
            <span w-class="append" style="margin-right: {{it.selected==ind?'40px':'80px'}}">{{val.num}}</span>
            {{if it.selected==ind}}
            <img src="../../res/image/16.png" style="width: 40px;height: 40px;"/>
            {{end}}
        </div>
        {{end}}
    </div>
    {{end}}
</div>
