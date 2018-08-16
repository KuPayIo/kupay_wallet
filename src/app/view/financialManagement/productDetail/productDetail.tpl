<div class="ga-new-page" w-class="ga-new-page" ev-back-click="goBackPage">
    <app-components-topBar-topBar>{title:"ETH资管第1期"}</app-components-topBar-topBar>
    <div w-class="expectedEarnings">
        <div w-class="centerBox">
            <div w-class="earningsTitle">
                预期年化收益
            </div>
            <div w-class="number">{{it1.profit}}</div>
        </div>
    </div>
    <div w-class="baseInfo">
        <div w-class="flexOne">
            <div w-class="oneTitle">价格(ETH)</div>
            <div w-class="oneMain">{{it1.unitPrice}} ETH/份</div>
        </div>
        <span w-class="line"></span>
        <div w-class="flexOne">
                <div w-class="oneTitle">持续(天)</div>
                <div w-class="oneMain">{{it1.days}}</div>
        </div>
        <span w-class="line"></span>
        <div w-class="flexOne">
                <div w-class="oneTitle">剩余</div>
                <div w-class="oneMain">{{it1.surplus}}份</div>
        </div>
    </div>

    <div w-class="stepBox" style="display: {{it1.showStep ? 'block' : 'none'}};">
            <app-view-financialManagement-productDetail-step-step>{itemList:[{title:"申购日",content:"2018-08-02"},{title:"起息日",content:"2018-08-02"},{title:"到期日",content:"2018-08-02"}]}</app-components-step-step>
    </div>

    <div w-class="productInfo">
        <div w-class="productIntroduction">
            <div w-class="introductionTitle">
                产品简介
            </div>
            <div w-class="introductionMain">
                {{it1.productIntroduction}}
            </div>
        </div>
        <div w-class="purchase">
            <div w-class="priceTitle">
                单价/份<span w-class="colorSpan">（限购{{it1.limit}}份）</span>
            </div>
            <div w-class="selectNum">
                <span w-class="unitPrice">
                    {{it1.unitPrice}}ETH
                </span>
                <div w-class="numInputSelectFloatBox">
                    <span w-class="fontIcon sub" on-tap="minus">-</span>
                    <input type="number" w-class="numInputInput" value="{{it1.amount}}"/>
                    <span w-class="fontIcon plus" on-tap="add">+</span>
                </div>
            </div>
            <div w-class="notice" on-tap="readNotice">
                    阅读声明
            </div>

            {{if it1.isSoldOut}}
            <div w-class="purchaseBtn soldout">
                    售罄
            </div>
            {{else}}
            <div w-class="purchaseBtn" on-tap="purchaseClicked">
                    购买
            </div>
            {{end}}

            
        </div>
    </div>
</div>