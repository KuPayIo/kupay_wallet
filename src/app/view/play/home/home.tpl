<div class="new-page" w-class="new-page" ev-next-click="toSearch">
   <div w-class="topBack">
        <app-components1-topBar-topBar1>{avatar:{{it.userInfo.avatar}},nextImg:"../../res/image1/searchGame.png" }</app-components1-topBar-topBar1>
    </div>
    <app-components1-offlineTip-offlineTip>{ offlienType:{{it.offlienType}} }</app-components1-offlineTip-offlineTip>
    <div w-class="body">
        {{for i,v of it.gameList}}
        <div  w-class="game-item" style="background-image: url({{it.gameList[0].img[0]}});" on-tap="gameClick({{i}})"></div>
        {{end}}
    </div>
</div>