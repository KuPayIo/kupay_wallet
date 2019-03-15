<div class="new-page" w-class="new-page" ev-refresh-click="refreshPage">
   <div w-class="topBack">
        <app-components1-topBar-topBar1>{avatar:{{it.avatar}} }</app-components1-topBar-topBar1>
    </div>
    <app-components1-offlineTip-offlineTip></app-components1-offlineTip-offlineTip>
    <div w-class="body">
        <app-components1-topRefresh-topRefresh  ev-before-load="beforeLoad" ev-loaded="loaded">{"top":"200px","loaded":{{it.loaded}}}</app-components1-topRefresh-topRefresh>
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