<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="top-head">
        <app-components1-topBar-topBar>{"title":{{it1.tx.txType === 1 ? it1.cfgData.topBarTitle[0] : it1.cfgData.topBarTitle[1]}},background:"linear-gradient(to right,#38CFE7,#318DE6)"}</app-components1-topBar-topBar>
    </div>
    <div w-class="body">
        <div w-class="status-container">
            <img src="../../../res/image/{{it1.statusIcon}}" w-class="status-icon"/>
            <div w-class="status">{{it1.statusShow}}</div>
            {{if it1.canResend}}
            <div w-class="resend-btn" on-tap="resendClick">{{it1.cfgData.reSend}}</div>
            {{end}}
        </div>
        <div w-class="detail-top">
            <div w-class="amount">{{it1.tx.txType === 1 ? '-' : '+'}}{{it1.tx.pay}}&nbsp;{{it1.tx.currencyName}}</div>
            <div w-class="item">
                <div w-class="tag">{{it1.cfgData.tags[0]}}</div>
                <div w-class="content"><span>{{it1.tx.toAddr}}</span><img src="../../../res/image/copy.png" w-class="copy" on-tap="copyToAddr"/></div>
            </div>
            <div w-class="item">
                <div w-class="tag">{{it1.cfgData.tags[1]}}</div>
                <div w-class="content"><span>{{it1.tx.fee}}&nbsp;{{it1.minerFeeUnit}}</span></div>
            </div>
            <div w-class="item">
                <div w-class="tag">{{it1.cfgData.tags[2]}}</div>
                <div w-class="content"><span>{{it1.tx.info ? it1.tx.info : "无"}}</span></div>
            </div>
        </div>
        <div w-class="detail-bottom">
            <div w-class="item" style="margin:0;">
                <div w-class="tag">{{it1.cfgData.tags[3]}}</div>
                <div w-class="content"><span>{{it1.timeShow}}</span></div>
            </div>
            <div w-class="item">
                <div w-class="tag">{{it1.cfgData.tags[4]}}</div>
                <div w-class="content"><span>{{it1.hashShow}}</span><img src="../../../res/image/copy.png" w-class="copy" on-tap="copyHash"/></div>
            </div>
            <div w-class="item">
                <div w-class="tag">{{it1.cfgData.tags[5]}}</div>
                <div w-class="content"><span>{{it1.tx.fromAddr}}</span><img src="../../../res/image/copy.png" w-class="copy" on-tap="copyFromAddr"/></div>
            </div>
            <div w-class="qrcode-container">
                <app-components-qrcode-qrcode>{value:{{it1.qrcode}},size:200}</app-components-qrcode-qrcode>
                <div w-class="copy-ethersacn" on-tap="openNewWeb">{{it1.webText}}</div>
            </div>
        </div>
    </div>
</div>