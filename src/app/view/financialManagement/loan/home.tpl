<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="ga-header">
        <app-components-topBar-topBar>{title:"币币贷",style:"background-color:transparent;color:#fff;",iconColor:"white"}</app-components-topBar-topBar>
        <div w-class="ga-header-content-container">    
            <div w-class="ga-bill-container">
                <span w-class="ga-title">5月账单(元)</span>
                <span w-class="ga-costs">￥1966.69</span>
                <span w-class="ga-balance">总金额 40000元</span>
            </div>
            <div w-class="ga-bill-msg">
                <span w-class="ga-item">
                    <span w-class="ga-item-1">最低应还</span>
                    <span w-class="ga-item-2">￥1966.69</span>
                </span>
                <span w-class="ga-item">
                    <span w-class="ga-item-1">账单日</span>
                    <span w-class="ga-item-2">05-19</span>
                </span>
                <span w-class="ga-item" style="border-right:1px solid transparent;">
                    <span w-class="ga-item-1">还款日</span>
                    <span w-class="ga-item-2">06-07</span>
                </span>
            </div>
        </div>
    </div>

    <div w-class="ga-bottom-container">
        <div w-class="ga-bottom-item ga-unbilled-container">
            <div w-class="ga-unbilled-title">未出账单</div>
            <div w-class="ga-bill-box">
                <span w-class="ga-bill-date">账单日 06/19</span>
                <span w-class="ga-bill-num">￥1966.69</span>
            </div>
        </div>
        <div w-class="ga-bottom-list">
            <div w-class="ga-list-item" on-tap="instalmentRecordsClick">
                <img src="../../../res/image/icon_fund_annal.png" w-class="ga-list-item-icon"/>
                <div w-class="ga-list-item-text">分期记录</div>
                <img src="../../../res/image/btn_right_arrow.png" w-class="ga-list-item-arrow"/>
            </div>
            <div w-class="ga-list-item" on-tap="historicalBillClick">
                <img src="../../../res/image/icon_fund_bill.png" w-class="ga-list-item-icon"/>
                <div w-class="ga-list-item-text">历史账单</div>
                <img src="../../../res/image/btn_right_arrow.png" w-class="ga-list-item-arrow"/>
            </div>
        </div>
    </div>
    <div w-class="ga-btn-bottom">还款</div>
</div>