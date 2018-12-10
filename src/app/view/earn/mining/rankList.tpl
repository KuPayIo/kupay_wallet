<div class="new-page" ev-next-click="goHistory" ev-back-click="backPrePage" ev-refresh-click="refreshPage" style="display: flex;flex-direction: column;">
    <div w-class="title-container">
        {{: topBarTitle = {"zh_Hans":"排名","zh_Hant":"排名","en":""} }}
        <app-components1-topBar-topBar>{"title":{{topBarTitle}},"background":"linear-gradient(to right,#25D8A0,#33CACC)",nextImg:"../../res/image/26_white.png",refreshImg:"../../res/image1/refresh_white.png"}</app-components1-topBar-topBar>
        <div w-class="nav">
            {{: tabTitle = [{"zh_Hans":"挖矿","zh_Hant":"挖礦","en":""},{"zh_Hans":"矿山总量","zh_Hant":"礦山總量","en":""}] }}

            {{for i,v of it.tabs}} {{let isActive = (i==it.activeNum)}}
            <div w-class="nav-item {{isActive ? 'is-active' : ''}}" on-tap="tabsChangeClick({{i}})">
                <pi-ui-lang>{{tabTitle[i]}}</pi-ui-lang>
            </div>
            {{end}}
        </div>
    </div>

    <app-view-earn-mining-miningRank>{{it.tabs[it.activeNum]}}</app-view-earn-mining-miningRank>
</div>