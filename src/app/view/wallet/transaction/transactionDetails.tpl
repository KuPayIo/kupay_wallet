<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="shareScreen">
    <div w-class="top-head">

        {{if it1.tx.txType === 1}}
            {{: topBarTitle = {"zh_Hans":"转账","zh_Hant":"轉賬","en":""} }}
        {{else}}
            {{: topBarTitle = {"zh_Hans":"收款","zh_Hant":"收款","en":""} }}
        {{end}}
  
        <widget w-tag="app-components1-topBar-topBar">{"title":{{topBarTitle}},background:"linear-gradient(to right,#38CFE7,#318DE6);position: fixed;",nextImg:"../../res/image/share_white.png"}</widget>

    </div>
    <div w-class="body">
        <div w-class="status-container">
            <img src="../../../res/image/{{it1.statusIcon}}" w-class="status-icon"/>
            <div w-class="status">{{it1.statusShow}}</div>
            {{if it1.canResend}}
            <div w-class="resend-btn" on-tap="resendClick">
                <pi-ui-lang>{"zh_Hans":"重新发送","zh_Hant":"重新發送","en":""}</pi-ui-lang>
            </div>
            {{end}}
        </div>
        <div w-class="detail-top">

            {{: tags = [
                {"zh_Hans":"收币地址","zh_Hant":"收幣地址","en":""},
                {"zh_Hans":"矿工费","zh_Hant":"礦工費","en":""},
                {"zh_Hans":"备注","zh_Hant":"備註","en":""},
                {"zh_Hans":"交易时间","zh_Hant":"交易時間","en":""},
                {"zh_Hans":"交易号","zh_Hant":"交易號","en":""},
                {"zh_Hans":"发币地址","zh_Hant":"發幣地址","en":""}] }}


            <div w-class="amount">{{it1.tx.txType === 1 ? '-' : '+'}}{{it1.tx.pay}}&nbsp;{{it1.tx.currencyName}}</div>
            <div w-class="item" on-tap="copyToAddr">
                <div w-class="tag"><pi-ui-lang>{{tags[0]}}</pi-ui-lang></div>
                <div w-class="content"><span>{{it1.tx.toAddr}}</span><img src="../../../res/image/copy.png" w-class="copy"/></div>
            </div>
            <div w-class="item">
                <div w-class="tag"><pi-ui-lang>{{tags[1]}}</pi-ui-lang></div>
                <div w-class="content"><span>{{it1.tx.fee}}&nbsp;{{it1.minerFeeUnit}}</span></div>
            </div>
            <div w-class="item">
                <div w-class="tag"><pi-ui-lang>{{tags[2]}}</pi-ui-lang></div>
                <div w-class="content"><span>{{it1.tx.info ? it1.tx.info : "无"}}</span></div>
            </div>
        </div>
        <div w-class="detail-bottom">
            <div w-class="item" style="margin:0;">
                <div w-class="tag"><pi-ui-lang>{{tags[3]}}</pi-ui-lang></div>
                <div w-class="content"><span>{{it1.timeShow}}</span></div>
            </div>
            <div w-class="item" on-tap="copyHash">
                <div w-class="tag"><pi-ui-lang>{{tags[4]}}</pi-ui-lang></div>
                <div w-class="content"><span>{{it1.hashShow}}</span><img src="../../../res/image/copy.png" w-class="copy" /></div>
            </div>
            <div w-class="item" on-tap="copyFromAddr">
                <div w-class="tag"><pi-ui-lang>{{tags[5]}}</pi-ui-lang></div>
                <div w-class="content"><span>{{it1.tx.fromAddr}}</span><img src="../../../res/image/copy.png" w-class="copy" /></div>
            </div>
            <div w-class="qrcode-container" on-tap="openNewWeb">
                <app-components-qrcode-qrcode>{value:{{it1.qrcode}},size:200}</app-components-qrcode-qrcode>
                <div w-class="copy-ethersacn">{{it1.webText}}</div>
            </div>
        </div>
    </div>
</div>