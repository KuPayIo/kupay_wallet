<div class="new-page" w-class="new-page" ev-next-click="toSearch">
   {{if 0}}
    <div w-class="topBack">
        <app-components1-topBar-topBar1>{avatar:{{it.avatar}},nextImg:"../../res/image1/searchGame.png" }</app-components1-topBar-topBar1>
    </div>
    {{end}}
    
    <app-components1-offlineTip-offlineTip>{ offlienType:{{it.offlienType}} }</app-components1-offlineTip-offlineTip>
    <div w-class="body">
        {{if it.showLoadding}}
        <div w-class="pi-loading-mask">
            <div w-class="pi-loading-spinner">
                <div w-class="loading-img"></div>
                <p w-class="pi-loading-text">
                    支付中
                </p>
            </div>
        </div>
        {{end}}
        {{for i,v of it.gameList}}
        <div w-class="game-item" style="background-image: url({{v.img[0]}});" on-tap="gameClick({{i}})"></div>
        {{end}}
    </div>
</div>