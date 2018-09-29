<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="title-container">
        <app-components1-topBar-topBar>{"title":{{it.product.productName}},background:"#fff"}</app-components1-topBar-topBar>
        <div w-class="head1 {{'head1-' + it1.stateBg}}">
            <div w-class="head1-tag">{{it1.cfgData.tags[0]}} ({{it.product.coinType}})</div>
            <div w-class="ye-earn">{{it.product.yesterdayIncoming}}</div>
            <div w-class="status">{{it1.stateShow}}</div>
            <div w-class="head2">
                <div w-class="col1">
                    <div w-class="tag">{{it1.cfgData.tags[1]}}</div>
                    <div w-class="content">{{it.product.profit}}%</div>
                </div>
                <div w-class="line"></div>
                <div w-class="col2">
                    <div w-class="tag">{{it1.cfgData.tags[2]}} ({{it.product.coinType}})</div>
                    <div w-class="content">{{it.product.totalIncoming}}</div>
                </div>
                <div w-class="line"></div>
                <div w-class="col1">
                    <div w-class="tag">{{it1.cfgData.tags[3]}}</div>
                    <div w-class="content">{{it.product.days}}</div>
                </div>
            </div>
        </div>
    </div>
    <div w-class="bottom-box">
        <div w-class="row5">{{it.product.productIntroduction}}</div>
        <div w-class="title">{{it1.cfgData.otherMess}}</div>
        <div w-class="detail-box">
            <div w-class="detail">{{it1.cfgData.details[0] + it.product.purchaseDate}}</div>
            <div w-class="detail">{{it1.cfgData.details[1] + it.product.unitPrice}}{{it.product.coinType}}</div>
            <div w-class="detail">{{it1.cfgData.details[2] + it.product.productName}}</div>
            <div w-class="detail">{{it1.cfgData.details[3] + it.product.amount it1.cfgData.per }}</div>
            <div w-class="detail">{{it1.cfgData.details[4] + it.product.profit}}%</div>
            <div w-class="detail">{{it1.cfgData.details[5] + it.product.lockday}}</div>
        </div>
        <div w-class="read">{{it1.cfgData.readAgree}}</div>
        <div ev-btn-tap="redemptionClick" w-class="btn"><app-components1-btn-btn>{"name":{{it1.btnText}},"types":"big","color":{{it1.btnBgColor}}}</app-components1-btn-btn></div>
    </div>
</div>