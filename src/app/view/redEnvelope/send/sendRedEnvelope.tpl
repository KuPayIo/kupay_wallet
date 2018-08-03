<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="ga-title-bar" ev-back-click="backPrePage">
        <app-components-topBar-topBar>{title:"发红包",iconColor:"white",style:"color:#fff;backgroundColor:#DF5E5E;"}</app-components-topBar-topBar>
        <div w-class="ga-red-envelope-record" on-tap="redEnvelopeRecordsClick">红包记录</div>
    </div>
    <div w-class="ga-body">
        <div w-class="ga-item-box" on-tap="chooseCurrencyClick">
            <div w-class="ga-balance-inner-box"><span w-class="ga-balance-title">余额</span><span w-class="ga-balance">{{it1.balance}}</span><span>{{it1.currencyName}}</span></div>
            <div w-class="ga-choose-currency"><span>{{it1.currencyName}}</span><img w-class="ga-currency-img" src="../../../res/image/right_arrow.png"/></div>
        </div>
        {{if it1.itype === 0}}
        <div w-class="ga-item-box">
            <span w-class="ga-tag">单个金额</span>
            <div w-class="ga-amount-inner">
                <div ev-input-change="singleAmountInputChange" w-class="input-father">
                    <app-components-input-input_simple>{itype:"number",style:"fontSize:32px;textAlign:right;",input:{{it1.singleAmount}},placeHolder:"0"}</app-components-input-input_simple>
                </div>
                <span w-class="ga-currency-name">{{it1.currencyName}}</span>
            </div>
        </div>
        {{else}}
        <div w-class="ga-item-box">
            <div w-class="ga-box">
                <img src="../../../res/image/currency/AION.png"/>
                <span w-class="ga-tag ga-total-tag">总金额</span>
            </div>
            <div w-class="ga-amount-inner">
                <div ev-input-change="totalAmountInputChange" w-class="input-father">
                    <app-components-input-input_simple>{itype:"number",style:"fontSize:32px;textAlign:right;",input:{{it1.singleAmount}},placeHolder:"0"}</app-components-input-input_simple>
                </div>
                <span w-class="ga-currency-name">{{it1.currencyName}}</span>
            </div>
        </div>
        {{end}}
        <div w-class="ga-item-box">
            <span w-class="ga-tag">红包个数</span>
            <div w-class="ga-number-inner">
                <div ev-input-change="redEnvelopeNumberChange" w-class="input-father">
                    <app-components-input-input_simple>{itype:"number",style:"fontSize:32px;textAlign:right;",input:{{it1.redEnvelopeNumber}},placeHolder:"0"}</app-components-input-input_simple>
                </div>
                <span w-class="ga-number-unit">个</span>
            </div>
        </div>
        <div w-class="ga-item-box">
            <div w-class="ga-type"><span>{{it1.itype === 0 ? "每个红包金额固定，" : "每个红包金额随机，"}}</span>
                <span w-class="ga-switch" on-tap="redEnvelopeTypeSwitchClick">{{it1.itype === 0 ? "改为拼手气红包" : "改为普通红包"}}</span>
            </div>
        </div>
        <div w-class="ga-item-box">
            <span w-class="ga-tag">留言</span>
            <div w-class="ga-leave-message input-father" ev-input-change="leaveMessageChange">
                <app-components-input-input_simple>{placeHolder:{{it1.leaveMessage}},style:"fontSize:32px;textAlign:right;"}</app-components-input-input_simple>
            </div>
        </div>
        <div w-class="ga-send-amount">{{it1.totalAmount}}&nbsp;{{it1.currencyName}}</div>
        <div w-class="ga-send-btn" on-tap="sendRedEnvelopeClick">塞钱进红包</div>
        <div w-class="ga-tips">可以直接使用云账户里的货币发红包</div>
    </div>
</div>