<div class="new-page" w-class="new-page">
    <div w-class="topBack">
        <img src="../../../res/image1/topbar_backimg.png" w-class="backImg"/>
        <app-components1-topBar-topBar1>{avatar:{{it.avatar}} }</app-components1-topBar-topBar1>
    </div>
    <div w-class="body">
        <widget w-tag="app-components1-card-card" on-tap="gameClick(0)">{title:{{it.gameList[0].title}},img:{{it.gameList[0].img}},desc:{{it.gameList[0].desc}} }</widget>
        
        <div w-class="hot-games">
            <div w-class="hot-game-title"><pi-ui-lang>{"zh_Hans":"热门DApp","zh_Hant":"熱門DApp","en":""}</pi-ui-lang></div>
            {{for ind,item of it.gameList}}
                {{if ind != 0}}
                <widget w-tag="app-components1-card-card" on-tap="gameClick({{ind}})">{title:{{item.title}},img:{{item.img}},desc:{{item.desc}} }</widget>
                {{end}}
            {{end}}
            
        </div>

        {{% 支付宝、微信充值测试}}
        <div style="width:100%;"> 
            <p style="font-size:36px;border: 1px solid brown;margin: 0">充值GT测试</p>
            <input type="number" value="" id="total" placeholder="total" style="width:100%;height: 50px;font-size: 26px;box-sizing:border-box;"/>
            <input type="number" value="" id="gt" placeholder="gt" style="width:100%;height: 50px;font-size: 26px;box-sizing:border-box;"/>
            <input type="number" value="" id="payType" placeholder="payType" style="width:100%;height: 50px;font-size: 26px;box-sizing:border-box;"/>
            <input type="text" value="" id="body" placeholder="body" style="width:100%;height: 50px;font-size: 26px;box-sizing:border-box;"/>
            <button on-tap="payBtn" id="payBtn" style="width:100%;height: 50px;font-size: 26px;">GT充值</button>
        </div>

    </div>
</div>