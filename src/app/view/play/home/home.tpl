<div class="new-page" w-class="new-page" ev-refresh-click="refreshPage">
    <div w-class="topBack">
        <app-components1-topBar-topBar1>{avatar:{{it.avatar}} }</app-components1-topBar-topBar1>
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
    <div w-class="body">
        <widget w-tag="app-components1-card-card" on-tap="activityClick(0)">{title:{{it.activityList[0].title}},img:{{it.activityList[0].img}},desc:{{it.activityList[0].desc}},isFirst:true }</widget>
        <div w-class="hot-games">
            <div w-class="hot-game-title"><pi-ui-lang>{"zh_Hans":"热门DApp","zh_Hant":"熱門DApp","en":""}</pi-ui-lang></div>
            {{for ind,item of it.gameList}}
                <widget w-tag="app-components1-card-card" on-tap="gameClick({{ind}})">{title:{{item.title}},img:{{item.img}},desc:{{item.desc}} }</widget>
            {{end}}
            {{for ind,item of it.activityList}}
                {{if ind !== 0}}
                <widget w-tag="app-components1-card-card" on-tap="activityClick({{ind}})">{title:{{item.title}},img:{{item.img}},desc:{{item.desc}} }</widget>
                {{end}}
            {{end}}
            
        </div>

    </div>
</div>