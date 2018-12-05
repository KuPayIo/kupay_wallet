<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="shareScreen">
    <div w-class="top-head">
        {{: topBarTitle = {"zh_Hans":"充值","zh_Hant":"充值","en":""} }}
        <widget w-tag="app-components1-topBar-topBar">{"title":{{topBarTitle}},background:"linear-gradient(to right,#38CFE7,#318DE6);position: fixed;",nextImg:"../../res/image/share_white.png"}</widget>

    </div>
    <div w-class="body">
        <div w-class="status-container">
            <img src="../../../res/image/icon_right2.png" w-class="status-icon"/>
            <div w-class="status">{{it.state}}</div>
        </div>
        <div w-class="detail-top">

            {{: tags = [
                {"zh_Hans":"金额","zh_Hant":"金額","en":""},
                {"zh_Hans":"类型","zh_Hant":"類型","en":""},
                {"zh_Hans":"交易时间","zh_Hant":"交易時間","en":""}] }}


            <div w-class="amount">+{{it.GTNum}}&nbsp;GT</div>
            <div w-class="item">
                <div w-class="tag"><pi-ui-lang>{{tags[0]}}</pi-ui-lang></div>
                <div w-class="content"><span>￥{{it.money}}</span></div>
            </div>
            <div w-class="item">
                <div w-class="tag"><pi-ui-lang>{{tags[1]}}</pi-ui-lang></div>
                <div w-class="content"><span>{{it.transactionType}}</span></div>
            </div>
            <div w-class="item">
                <div w-class="tag"><pi-ui-lang>{{tags[2]}}</pi-ui-lang></div>
                <div w-class="content"><span>{{it.transactionTime}}</span></div>
            </div>
        </div>
    </div>
</div>