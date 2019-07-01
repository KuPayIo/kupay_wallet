<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="refreshClick">
    <div w-class="title-container">
        {{: topBarTitle = {"zh_Hans":"优选理财","zh_Hant":"優選理財","en":""} }}
        <app-components-topBar-topBar>{"title":{{topBarTitle}},background:"linear-gradient(to right,#38CFE7,#318DE6)",refreshImg:"../../res/image1/refresh_white.png"}</app-components-topBar-topBar>
        <div w-class="nav-wrap">
            <div w-class="nav">
                {{for i,v of it.tabs}} {{let isActive = i===it.activeNum}}
                <div w-class="nav-item {{isActive ? 'is-active' : ''}}" on-tap="tabsChangeClick(e,{{i}})">
                    {{v.tab}}
                </div>
                {{end}}
            </div>
        </div>
    </div>
    {{for i,v of it.tabs}} {{let isActive = i===it.activeNum}}
    <div style="position:relative;{{isActive ? 'flex:1 0 0;' : ''}}">
        <widget w-tag={{v.components}} style="visibility: {{isActive ? 'visible' : 'hidden'}}; z-index:{{isActive ? 0 : -1}};  width:100%;height: 100%;">{isActive:{{isActive}}}</widget>
    </div>
    {{end}}
</div>