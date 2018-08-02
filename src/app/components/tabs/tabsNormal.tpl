<div w-class="base">
    <div w-class="nav-wrap" class="tabs-nav-wrap">
        <div w-class="nav-scroll">
            <div w-class="nav">
                {{for i,v of it.list}} {{let isActive = i===it.activeNum}}{{let isFirst = i===0}}
                <div w-class="nav-item {{isFirst?'first-item':''}} {{isActive?'is-active-normal':''}}" class="tabs-item" style="font-size: 28px;height: 80px;line-height: 80px;" on-tap="doClick(e,{{i}})">
                    <span w-class="nav-span-normal{{isActive?'-activity':''}}">{{v}}</span>
                </div>
                {{end}}
            </div>
        </div>
    </div>
</div>