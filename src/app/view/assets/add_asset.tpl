<div w-class="base">
    <div w-class="header" title="36px">
        <div w-class="header-bg"></div>
        <div w-class="title " style="top: 9px; transform-origin: 185.5px 13px 0px;">
            <span>{{it1.title}}</span>
        </div>
        <div w-class="back" style="cursor: pointer;" on-tap="doClose">
            <img w-class="img-back" src="../../res/image/u12.png" />
        </div>
        <div w-class="search" style="cursor: pointer;" on-tap="doSearch">
            <div w-class="search1">
                <img w-class="img-search1" src="../../res/image/u591.png" />
            </div>
            <div w-class="search2">
                <img w-class="img-search2" src="../../res/image/u592.png" />
            </div>
        </div>
    </div>

    <div w-class="body">
        {{for i,each of it1.list}}
        <div w-class="each" ev-switch-click="onSwitchChange(e,{{i}})">
            <div w-class="icon">logo</div>
            <div w-class="name">{{each.name}}</div>
            <div w-class="description">{{each.description}}</div>
            <div w-class="switch">
                <pi-components-switch-switch>{type:{{each.isChoose}} }</pi-components-switch-switch>
            </div>
        </div>
        {{end}}
    </div>

</div>