{{let item = it1.list[it1.selected]}}
<div class="new-page" style="background: #F2F2F2;" ev-back-click="backPrePage" ev-next-click="goHistory">
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}},nextImg:"../../res/image/26_white.png",background:"#F46262;"}</app-components1-topBar-topBar>

    <form w-class="content" ev-selectBox-change="changeCoin" id="content">
        <app-components-selectBox-selectBox>{list:{{it1.list}},selected:{{it1.selected}} }</app-components-selectBox-selectBox>
        <div style="font-size: 28px;color: #888888;margin: 30px;">{{it1.cfgData.changePin[0]}} {{it1.showPin ? it1.cfgData.changePin[1] : it1.cfgData.changePin[2]}} {{it1.cfgData.changePin[3]}}
            <span style="color: #3988E8;" on-tap="changePin">{{it1.showPin? it1.cfgData.redEnvType[0] : it1.cfgData.redEnvType[1]}}</span>
        </div>
        <div ev-input-change="changeAmount">
            <app-components-basicInput-basicInput>{
                prepend:{{it1.showPin? it1.cfgData.amountTitle[0] : it1.cfgData.amountTitle[1]}},
                placeholder:"0",
                itype:"number",
                append:{{item.name}},
                isShowPin:{{it1.showPin}},
                input:{{it1.oneAmount}}
            }</app-components-basicInput-basicInput>
        </div>
        <div style="margin: 10px 0;" ev-input-change="changeNumber">
            <app-components-basicInput-basicInput>{
                prepend:{{it1.cfgData.countTitle[0]}},
                placeholder:"0",
                itype:"number",
                append:{{it1.cfgData.countTitle[1]}},
                input:{{it1.totalNum}}
            }</app-components-basicInput-basicInput>
        </div>
        <div style="margin: 10px 0;" ev-input-change="changeMessage">
            <app-components-basicInput-basicInput>{
                prepend:{{it1.cfgData.messTitle[0]}},
                placeholder:{{it1.cfgData.messTitle[1]}},
                input:{{it1.message}}
            }</app-components-basicInput-basicInput>
        </div>
        <div w-class="totalNum">{{it1.totalAmount+" "+item.name}}</div>
        <div style="margin: 0 40px;" ev-btn-tap="send">
            <app-components1-btn-btn>{"name":{{it1.cfgData.btnName}},"types":"big","style":"background:#F46262;"}</app-components1-btn-btn>
        </div>
        <div style="font-size: 24px;color: #888888;text-align: center;margin-top: 40px;">{{it1.cfgData.tips[0]}}</div>
    </form>
    
</div>