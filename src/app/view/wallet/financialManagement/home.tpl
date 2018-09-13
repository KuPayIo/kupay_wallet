<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="title-container">
        <app-components1-topBar-topBar>{"title":"优选理财",background:"linear-gradient(to right,#38CFE7,#318DE6)"}</app-components1-topBar-topBar>
        <div w-class="nav-wrap">
            <div w-class="nav">
                {{for i,v of it1.tabs}} {{let isActive = i===it1.activeNum}}
                <div w-class="nav-item {{isActive ? 'is-active' : ''}}" on-tap="tabsChangeClick(e,{{i}})">
                    {{v.tab}}
                </div>
                {{end}}
            </div>
        </div>
    </div>
    {{for i,v of it1.tabs}} {{let isActive = i===it1.activeNum}}
    <div style="position:relative;flex:1 0 0;">
    <widget w-tag={{v.components}} style="visibility: {{isActive ? 'visible' : 'hidden'}}; z-index:{{isActive ? 0 : -1}};  width:100%;height: 100%;">{isActive:{{isActive}}}</widget>
    </div>
    {{end}}
</div>