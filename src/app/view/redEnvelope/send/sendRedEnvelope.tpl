<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="ga-title-bar" ev-back-click="backPrePage">
        <app-components-topBar-topBar>{title:"发红包",iconColor:"white",style:"color:#fff;backgroundColor:#DF5E5E;"}</app-components-topBar-topBar>
        <div w-class="ga-red-envelope-record" on-tap="redEnvelopeRecordsClick">红包记录</div>
    </div>
    <div w-class="ga-body">
        <div w-class="ga-balance-box">
            <div w-class="ga-balance-inner-box"><span w-class="ga-balance-title">余额</span><span w-class="ga-balance">{{it1.balance}}</span></div>
        </div>
        <div w-class="ga-item-box">
            <span w-class="ga-tag">单个金额</span>
            <div w-class="ga-amount-inner">
                <div ev-input-change="amountInputChange">
                    <app-components-input-input>{itype:"number"}</app-components-input-input>
                </div>
                <span w-class="ga-currency-name">{{it1.currencyName}}</span>
            </div>
        </div>
        <div w-class="ga-item-box">
            <span w-class="ga-tag">留言</span>
            <div w-class="ga-leave-message" ev-input-change="leaveMessageChange">
                <app-components-input-input>{placeHolder:{{it1.leaveMessage}}}</app-components-input-input>
            </div>
        </div>
        <div w-class="ga-send-amount">{{it1.amount}}&nbsp;{{it1.currencyName}}</div>
        <div w-class="ga-send-btn" on-tap="sendRedEnvelopeClick">塞钱进红包</div>
        <div w-class="ga-tips">未领取的红包，将于24小时退回云端账户</div>
    </div>
</div>