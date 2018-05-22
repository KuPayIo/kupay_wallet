<div w-class="base">
    <div w-class="bg" on-tap="doClose"></div>
    <div w-class="show-list">
        {{for i,each of it1.list}}
        <div w-class="each" on-tap="chooseAddr(e,{{i}})">
            {{if each.isChoose}}
            <div w-class="is-choose">√</div>
            {{end}}
            <div w-class="name">{{each.name}}</div>
            <div w-class="balance">{{each.balance}}</div>
        </div>
        {{end}}
        <div w-class="add-addr" on-tap="addAddr">添加地址</div>
    </div>
</div>