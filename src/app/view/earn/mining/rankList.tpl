<div class="new-page" ev-next-click="goHistory" ev-back-click="backPrePage">
    <div w-class="title-container">
        <app-components1-topBar-topBar>{"title":"排名","background":"linear-gradient(to right,#25D8A0,#33CACC)",nextImg:"../../res/image/26_white.png"}</app-components1-topBar-topBar>
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
   
    <app-view-earn-mining-miningRank>{"fg":{{it1.activeNum}} }</app-view-earn-mining-miningRank>
   
</div>