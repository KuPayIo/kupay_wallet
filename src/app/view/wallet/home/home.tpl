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
        {{if !it.isLogin}}
        <div w-class="netClose" style="font-size:28px;color:rgba(34,34,34,1);line-height:48px;display: flex;align-items: center;padding: 20px 30px;background: #E9F9FF;height: 88px;">
            <img src="../../../res/image/question_blue.png" style="width:32px;margin-right: 10px;"/>
            <span style="margin-right:20px;">网络连接不可用&nbsp;<span style="color:#388EFF;" on-tap="reConnect">点击重连</span></span>
            {{if it.reconnecting}}
            <app-components1-loading-loading2>{}</app-components1-loading-loading2>
            {{end}}
        </div>
        {{end}}
    </div>
    {{for i,v of it.tabs}} {{let isActive = i===it.activeNum}}
    <widget w-tag={{v.components}} style="visibility: {{isActive ? 'visible' : 'hidden'}}; z-index:{{isActive ? 0 : -1}};  width:100%;{{isActive ? 'flex:1 0 0;overflow-x: hidden;overflow-y: auto;scroll-behavior: smooth;-webkit-overflow-scrolling: touch;' : 'height: 0;'}}">{isActive:{{isActive}}}</widget>
    {{end}}
</div>