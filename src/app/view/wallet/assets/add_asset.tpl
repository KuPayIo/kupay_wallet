<div w-class="base">
    <div w-class="header" title="36px" ev-back-click="doClose">
        <app-components-topBar-topBar>{title:{{it1.title}}}</app-components-topBar-topBar>
        <div w-class="search" style="cursor: pointer;" on-tap="doSearch">
            <div w-class="search1">
                <img w-class="img-search1" src="../../../res/image/u591.png" />
            </div>
            <div w-class="search2">
                <img w-class="img-search2" src="../../../res/image/u592.png" />
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