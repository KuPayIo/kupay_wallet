<div class="new-page" ev-next-click="goHistory" ev-back-click="backPrePage" style="display: flex;flex-direction: column;">
    <div w-class="title-container">
        <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}},"background":"linear-gradient(to right,#25D8A0,#33CACC)",nextImg:"../../res/image/26_white.png"}</app-components1-topBar-topBar>
        <div w-class="nav">
            {{for i,v of it1.tabs}} {{let isActive = i===it1.activeNum}}
            <div w-class="nav-item {{isActive ? 'is-active' : ''}}" on-tap="tabsChangeClick({{i}})">
                {{v.tab}}
            </div>
            {{end}}
        </div>
    </div>

    <app-view-earn-mining-miningRank>{{it1.tabs[it1.activeNum]}}</app-view-earn-mining-miningRank>
</div>