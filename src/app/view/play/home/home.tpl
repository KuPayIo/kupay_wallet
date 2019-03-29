<div class="new-page" w-class="new-page" ev-next-click="toSearch">
   <div w-class="topBack">
        <app-components1-topBar-topBar1>{avatar:{{it.avatar}},nextImg:"../../res/image1/searchGame.png" }</app-components1-topBar-topBar1>
    </div>
    <app-components1-offlineTip-offlineTip></app-components1-offlineTip-offlineTip>
    <div w-class="body">
        <widget w-tag="app-components1-card-card" on-tap="gameClick(0)">{title:{{it.gameList[0].title}},img:{{it.gameList[0].img}},desc:{{it.gameList[0].desc}},isFirst:true }</widget>
    </div>
</div>