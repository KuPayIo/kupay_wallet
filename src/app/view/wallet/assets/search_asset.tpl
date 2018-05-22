<div w-class="base">
    <div w-class="header" title="36px">
        <div w-class="header-bg"></div>
        <div w-class="input" ev-input-change="onInputChange">
            <pi-components-input-input>{placeHolder:"Search" }</pi-components-input-input>
        </div>
        <div w-class="back" on-tap="doClose">
            <span>取消</span>
        </div>
    </div>

    <div w-class="body">
        {{for i,each of it1.list}}
        <div w-class="each">
            <div w-class="icon">logo</div>
            <div w-class="name">{{each.name}}</div>
            <div w-class="description">{{each.description}}</div>
            {{if each.isChoose}}
            <div w-class="switched">
                <span>已添加</span>
            </div>
            {{else}}
            <div w-class="unswitch" on-tap="doAdd(e,{{i}})">
                <span>添加</span>
            </div>
            {{end}}

        </div>
        {{end}}
    </div>

</div>