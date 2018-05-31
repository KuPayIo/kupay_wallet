<div w-class="base">
    <div w-class="bg" on-tap="doClose"></div>
    <div w-class="show-list">
        <div style="max-height: 900px;overflow-y: auto;overflow-x: hidden;" class="hide-scrollbar">
            {{for i,each of it1.list}}
            <div w-class="each" on-tap="chooseAddr(e,{{i}})">
                <div w-class="name">{{each.name}}</div>
                {{if each.isChoose}}
                <div w-class="is-choose">√</div>
                {{end}}
                <div w-class="balance">{{each.balance}}&nbsp;{{it.currencyName}}</div>
            </div>
            {{end}}
        </div>
        <div w-class="add-addr" on-tap="addAddr">添加地址</div>
    </div>
</div>