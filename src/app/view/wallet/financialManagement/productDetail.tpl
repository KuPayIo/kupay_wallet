<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="body" on-scroll="pageScroll" id="body">
        <div w-class="top-head">
            <div w-class="row1">
                <div w-class="col1">
                    <div w-class="desc"><pi-ui-lang>{"zh_Hans":"预期年化收益","zh_Hant":"預期年化收益","en":""}</pi-ui-lang></div>
                    <div w-class="content">{{it.product.profit}}%</div>
                </div>
                <div w-class="col2">
                    <div w-class="desc"><pi-ui-lang>{"zh_Hans":"持续天数","zh_Hant":"持續天數","en":""}</pi-ui-lang></div>
                    <div w-class="content">{{it.product.days}}</div>
                </div>
            </div>
            {{: tips = [
                {"zh_Hans":"已售","zh_Hant":"已售","en":""},
                {"zh_Hans":"详细信息","zh_Hant":"詳細信息","en":""},
                {"zh_Hans":"单价/份","zh_Hant":"單價/份","en":""},
                {"zh_Hans":"限购","zh_Hant":"限購","en":""},
                {"zh_Hans":"份","zh_Hant":"份","en":""}] }}

            {{: detail = [
                {"zh_Hans":"价格：","zh_Hant":"價格：","en":""},
                {"zh_Hans":"剩余：","zh_Hant":"剩餘：","en":""},
                {"zh_Hans":"锁定期：无","zh_Hant":"鎖定期：無","en":""}] }}

            <div w-class="row2"><pi-ui-lang>{"zh_Hans":"以上利率均为预期年化结算利率，以实际回报为准","zh_Hant":"以上利率均為預期年化結算利率，以實際回報為準","en":""}</pi-ui-lang></div>
            <div w-class="row3"><div w-class="progress" style="width:{{it.usePercent}}%;"></div></div>
            <div w-class="row4">
                <div style="width:{{it.usePercent}}%;"></div>
                <div w-class="sold" >
                    <pi-ui-lang>{{tips[0]}}</pi-ui-lang> &nbsp;{{it.usePercent}}%
                </div>
            </div>
        </div>
    
        <div w-class="bottom-box">
            <div w-class="row5">{{it.product.productIntroduction}}</div>
            <div w-class="title"><pi-ui-lang>{{tips[1]}}</pi-ui-lang></div>
            <div w-class="detail-box">
                <div w-class="detail">
                    <pi-ui-lang>{{detail[0]}}</pi-ui-lang>
                    <span>
                        {{it.product.unitPrice}}&nbsp;{{it.product.coinType}}/<pi-ui-lang>{{tips[4]}}</pi-ui-lang>
                    </span>
                </div>
                <div w-class="detail">
                    <pi-ui-lang>{{detail[1]}}</pi-ui-lang> {{it.leftPercent}}%
                </div>
                <div w-class="detail"><pi-ui-lang>{{detail[2]}}</pi-ui-lang></div>
            </div>
            <div w-class="unit">
                <pi-ui-lang>{{tips[2]}}</pi-ui-lang>
                <div w-class="limit">
                    <span>（</span>
                        <span w-class="limit-number">
                            <pi-ui-lang>{{tips[3]}}</pi-ui-lang> 
                            {{it.product.limit}} 
                            <pi-ui-lang>{{tips[4]}}</pi-ui-lang> 
                        </span>
                    <span>）
                    </span>
                </div>
            </div>
            <div w-class="select-num">
                <span w-class="unit-price">
                    {{it.product.unitPrice}}&nbsp;{{it.product.coinType}}
                </span>
                <div w-class="right-box">
                    <img w-class="sub" on-down="minus" src="../../../res/image/less_blue.png"/>
                    <span>{{it.amount}}</span>
                    <img w-class="plus" on-down="add" src="../../../res/image/add.png" />
                </div>
            </div>
            <div w-class="read" on-tap="readAgree"><pi-ui-lang>{"zh_Hans":"阅读声明","zh_Hant":"閱讀聲明","en":""}</pi-ui-lang></div>
            <div ev-btn-tap="purchaseClicked" w-class="btn">
                {{: btnName = {"zh_Hans":"购买","zh_Hant":"購買","en":""} }}
                <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"gray"}</app-components1-btn-btn>
            </div>
        </div>
    </div>
    <app-components1-topBar-topBar2>{scrollHeight:{{it.scrollHeight}},text:{{it.product.productName}} }</app-components1-topBar-topBar2>

</div>