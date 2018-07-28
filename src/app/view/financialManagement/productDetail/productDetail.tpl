<div w-class="productDetailPage" class="ga-new-page" ev-back-click="goBackPage">
    <app-components-topBar-topBar>{title:"产品详情"}</app-components-topBar-topBar>
    <div w-class="profit">
        <p w-class="profitTitle">
            预期年化收益
        </p>
        <p w-class="profitNum">
            {{it1.expectedAnnualIncome}}
        </p>
        <div w-class="rules">
            <div>
                <p w-class="ruleTitle">{{it1.subscriptionPeriod}}</p>
                <p w-class="ruleContent">认购期限</p>
            </div>
            <div>
                <p w-class="ruleTitle">{{it1.purchaseAmount}}</p>
                <p w-class="ruleContent">起购金额</p>
            </div>
        </div>
    </div>
    <div w-class="process">
        <div w-class="processTitle">
            认购流程
        </div>
        <div w-class="processContent">
            <div w-class="stepBox">
                <app-view-financialManagement-productDetail-step-step>{step:0,itemList:[{title:"申购日",content:"{{it1.purchaseDay}}"},{title:"起息日",content:"{{it1.dayOfInterest}}"},{title:"到期日",content:"{{it1.dueDate}}"}]}</app-components-step-step>
            </div>
        </div>
    </div>
    <div w-class="productInfo">
        <div w-class="productDetail">
            <div w-class="title">
                产品详情
            </div>
            <div w-class="mainDetail">
                <p w-class="detailP">认购币种：
                    <span>{{it1.productDetail.subscribeCurrency}}</span>
                </p>
                <p w-class="detailP">收款方式：
                    <span>{{it1.productDetail.paymentMethod}}</span>
                </p>
                <p w-class="detailP">产品额度：
                    <span>{{it1.productDetail.productLine}}MPT</span>
                </p>
                <p w-class="detailP">额度限制：
                    <span>{{it1.productDetail.limit}}</span>
                </p>
                <p w-class="detailP">时间限制：
                    <span>{{it1.productDetail.timeLimit}}</span>
                </p>
            </div>
        </div>

        <div w-class="productIntroduction">
            <div w-class="title">
                产品简介
            </div>
            <div w-class="mainInfo">
                <p w-class="paragraph">
                    {{it1.productIntroduction}}
                </p>
            </div>
        </div>
    </div>
    <div style="width: 100%;height: 185px;">

    </div>
    <div w-class="bottomFixed">
        <div w-class="Surplus">
            剩余额度{{it1.surplusAmount}}MPT
            <div w-class="progressBar">
                <div w-class="barBackground" style="width: {{it1.percentage}};">
                </div>
            </div>
        </div>
        {{if it1.isSellOut}}
        <div w-class="butBottom">
            售罄
        </div>
        {{else}}
        <div w-class="butBottom active" on-tap="buyClicked">
            认购
        </div>
        {{end}}

    </div>

</div>