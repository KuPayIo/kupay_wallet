<div class="new-page" w-class="new-page">
    <div w-class="title-container" ev-refresh-click="refreshClick">
        <app-components1-topBar-topBar1>{avatar:{{it.avatar}},text:{{it.currencyUnitSymbol+it.totalAsset}} }</app-components1-topBar-topBar1>
       
        <div w-class="nav-wrap">
            <div w-class="nav">
                {{for i,v of it.tabs}} {{let isActive = i===it.activeNum}}
                <div w-class="nav-item {{isActive ? 'is-active' : ''}}" on-tap="tabsChangeClick(e,{{i}})">
                    <pi-ui-lang>{{v.tab}}</pi-ui-lang>
                </div>
                {{end}}
            </div>
        </div>
        <app-components1-offlineTip-offlineTip>{offlienType:{{it.offlienType}} }</app-components1-offlineTip-offlineTip>
    </div>
    {{for i,v of it.tabs}} {{let isActive = i===it.activeNum}}
    <widget w-tag={{v.components}} style="visibility: {{isActive ? 'visible' : 'hidden'}}; z-index:{{isActive ? 0 : -1}};  width:100%;{{isActive ? 'flex:1 0 0;overflow-x: hidden;overflow-y: auto;scroll-behavior: smooth;-webkit-overflow-scrolling: touch;' : 'height: 0;'}}">{isActive:{{isActive}}}</widget>
    {{end}}
</div>