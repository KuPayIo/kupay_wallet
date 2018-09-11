<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="top-head">
        <app-components1-topBar-topBar>{"title":{{it1.txType === 1 ? '转账' : '收款'}},background:"linear-gradient(to right,#38CFE7,#318DE6)"}</app-components1-topBar-topBar>
    </div>
    <div w-class="body">
        <div w-class="status-container">
            <img src="../../../res/image/{{it1.statusIcon}}" w-class="status-icon"/>
            <div w-class="status">{{it1.statusShow}}</div>
            {{if it1.canResend}}
            <div w-class="resend-btn" on-tap="resendClick">重新发送</div>
            {{end}}
        </div>
        <div w-class="detail-top">
            <div w-class="amount">{{it1.txType === 1 ? '-' : '+'}}{{it1.pay}}&nbsp;{{it1.currencyName}}</div>
            <div w-class="item">
                <div w-class="tag">收币地址</div>
                <div w-class="content"><span>{{it1.toAddr}}</span><img src="../../../res/image/copy.png" w-class="copy" on-tap="copyToAddr"/></div>
            </div>
            <div w-class="item">
                <div w-class="tag">矿工费</div>
                <div w-class="content"><span>{{it1.fee}}&nbsp;{{it1.minerFeeUnit}}</span></div>
            </div>
            <div w-class="item">
                <div w-class="tag">矿工费</div>
                <div w-class="content"><span>{{it1.info ? it1.info : "无"}}</span></div>
            </div>
        </div>
        <div w-class="detail-bottom">
            <div w-class="item" style="margin:0;">
                <div w-class="tag">交易时间</div>
                <div w-class="content"><span>{{it1.timeShow}}</span></div>
            </div>
            <div w-class="item">
                <div w-class="tag">交易号</div>
                <div w-class="content"><span>{{it1.hashShow}}</span><img src="../../../res/image/copy.png" w-class="copy" on-tap="copyHash"/></div>
            </div>
            <div w-class="item">
                <div w-class="tag">发币地址</div>
                <div w-class="content"><span>{{it1.fromAddr}}</span><img src="../../../res/image/copy.png" w-class="copy" on-tap="copyFromAddr"/></div>
            </div>
            <div w-class="qrcode-container">
                <app-components-qrcode-qrcode>{value:{{it1.qrcode}},size:200}</app-components-qrcode-qrcode>
                <div w-class="copy-ethersacn" on-tap="copyEtherscan">复制地址</div>
            </div>
        </div>
    </div>
</div>