<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="shareScreen">
    <div w-class="top-head">
        {{: topBarTitle1 = {"zh_Hans":"充值","zh_Hant":"充值","en":""} }}
        {{: topBarTitle2 = {"zh_Hans":"消费","zh_Hant":"消費","en":""} }}
        {{: topBarTitle = it.ctype === 1 ? topBarTitle1 : topBarTitle2 }}
        <widget w-tag="app-components-topBar-topBar">{"title":{{topBarTitle}},background:"linear-gradient(to right,#38CFE7,#318DE6);position: fixed;",nextImg:"../../res/image/share_white.png"}</widget>

    </div>
    <div w-class="body">
        <div w-class="status-container">
            {{if it.state === '支付成功' }}
                <img src="../../../res/image/icon_right2.png" w-class="status-icon"/>
            {{else}}
                <img src="../../../res/image/btn_img_close.png" w-class="status-icon"/>
            {{end}}
            <div w-class="status">{{it.state}}</div>
        </div>
        <div w-class="detail-top">
            {{if it.state !=='查询失败'}}
                {{if it.ctype === 1}}
                    {{: tags = [
                        {"zh_Hans":"金额","zh_Hant":"金額","en":""},
                        {"zh_Hans":"类型","zh_Hant":"類型","en":""},
                        {"zh_Hans":"交易时间","zh_Hant":"交易時間","en":""}] }}

                    <div w-class="amount">+{{it.amount}}&nbsp;{{it.scShow}}</div>
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
                {{else}}
                    {{: tags = [
                        {"zh_Hans":"收款方","zh_Hant":"收款方","en":""},
                        {"zh_Hans":"交易时间","zh_Hant":"交易時間","en":""},
                        {"zh_Hans":"订单号","zh_Hant":"訂單號","en":""}] }}

                    <div w-class="amount">+{{it.amount}}&nbsp;{{it.scShow}}</div>
                    <div w-class="item">
                        <div w-class="tag"><pi-ui-lang>{{tags[0]}}</pi-ui-lang></div>
                        <div w-class="content"><span>{{it.beneficiary}}</span></div>
                    </div>
                    <div w-class="item">
                        <div w-class="tag"><pi-ui-lang>{{tags[1]}}</pi-ui-lang></div>
                        <div w-class="content"><span>{{it.transactionTime}}</span></div>
                    </div>
                    <div w-class="item">
                        <div w-class="tag"><pi-ui-lang>{{tags[2]}}</pi-ui-lang></div>
                        <div w-class="content"><span>{{it.transactionId}}</span></div>
                    </div>
                {{end}}
            {{end}}
        </div>
    </div>
</div>