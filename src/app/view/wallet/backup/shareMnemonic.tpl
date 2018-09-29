<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="body">
        <app-view-wallet-components-tipsCard>{contentStyle:"color:#ef3838;",title:{{it1.cfgData.title}} ,content:{{it1.cfgData.content}} }</app-view-wallet-components-tipsCard>
        <div w-class="bottom-box">
            {{for i,v of it1.successList}}
            <div w-class="item" on-tap="shareItemClick(e,{{i}})">
                <img src="../../../res/image/number{{i + 1}}.png"/>
                <div w-class="share-box">
                    <div w-class="share-title">{{it1.cfgData.share}} </div>
                    <div w-class="share-fragment">{{it1.encryptFragments[i]}}</div>
                </div>
                <div w-class="choose-box">
                    {{if v}}
                    <img src="../../../res/image/icon_right2.png" w-class="choosed"/>
                    {{else}}
                    <div w-class="choose-inner"></div>
                    {{end}}
                </div>
            </div>
            {{end}}
        </div>
    </div>
</div>