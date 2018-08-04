<div class="ga-new-page" ev-back-click="goBackPage">
    <app-components-topBar-topBar>{title:"ETH资管第1期"}</app-components-topBar-topBar>
    <div w-class="expectedEarnings">
        <div w-class="centerBox">
            <div w-class="earningsTitle">
                昨日收益(ETH)
            </div>
            <div w-class="number">{{it1.yesterdayProfit}}</div>
        </div>
    </div>
    <div w-class="baseInfo">
        <div w-class="flexOne">
            <div w-class="oneTitle">累计收益(ETH)</div>
            <div w-class="oneMain">{{it1.totalProfit}}ETH</div>
        </div>
        <span w-class="line"></span>
        <div w-class="flexOne">
            <div w-class="oneTitle">持续(天)</div>
            <div w-class="oneMain">{{it1.continuedDay}}</div>
        </div>
        <span w-class="line"></span>
        <div w-class="flexOne">
            <div w-class="oneTitle">年化收益</div>
            <div w-class="oneMain">{{it1.annualIncome}}</div>
        </div>
    </div>

    <div w-class="contentBox">
        <diV w-class="productIntroduction">
            <div w-class="introductionTitle">
                    产品简介
            </div>
            <div w-class="introductionContent">
                    {{it1.productIntroduction}}
            </div>
        </diV>
        <div w-class="otherInfo">
            <div w-class="infoTitle">
                    其它信息
            </div>
            <div w-class="infoContent">
                <p>交易时间：{{it1.dealTime}}</p>
                <p>购买单价：{{it1.unitPrice}}ETH</p>
                <p>产品名称：{{it1.productName}}</p>
                <p>购买份数：{{it1.amount}}份</p>
                <p>年化收益：{{it1.annualIncome}}</p>
                <p>锁定期：{{it1.lockday}}</p>
            </div>
        </div>

        <div w-class="notice">
                阅读声明
        </div>
    </div>

    <div w-class="botBtn">
            赎回
    </div>
</div>