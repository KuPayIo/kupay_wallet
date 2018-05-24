<div class="ga-new-page" w-class="ga-new-page" ev-back-click="goBackClick">
    <app-components-topBar-topBar>{title:"历史账单"}</app-components-topBar-topBar>
    <div w-class="ga-year">2018年</div>
    <div w-class="ga-mothon-list">
        {{for index,bill of it1.billList}}
        <div w-class="ga-mothon-item" on-tap="billItemClick">
            <div w-class="ga-item-left">
                <span w-class="ga-left-month">{{bill.month}}月账单</span>
                <span w-class="ga-left-date">{{bill.date}}</span>
            </div>
            <div w-class="ga-item-right">
                <span w-class="ga-right-text">￥{{bill.value}}</span>
                <img src="../../../res/image/btn_right_arrow.png" w-class="ga-right-arrow"/>
            </div>
        </div>
        {{end}}
    </div>
</div>