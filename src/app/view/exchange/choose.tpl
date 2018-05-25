<div w-class="base" on-tap="close">
    <div w-class="bg"></div>
    <div w-class="menu-list" ev-tabs-change="onTabsChange">
        <pi-components-tabs-tabs>{list:{{it1.menuList}} } </pi-components-tabs-tabs>
    </div>
    <div w-class="result-list">
        {{for i,each of it1.resultList}}
        <div w-class="each" on-tap="choose(e,{{i}})">
            <img w-class="icon" src="{{each.icon}}" />
            <div w-class="name">{{each.name}}</div>
        </div>
        {{end}}
    </div>
</div>