<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="head" on-tap="toRecord">
        <span w-class="headTitle">我的理财</span>
        <img src="../../../res/image/cloud_arow_right.png" w-class="headArow" />
    </div>


        {{for i,v of it1.record}}
        {{if i>it1.record.length-3}}
        <div w-class="mineItem" on-tap="toRecordDetail({{i}})">
            <div w-class="mineTitle">
                {{v.productName}}
            </div>
            <div w-class="mineMain">
                <div w-class="mainLeft">
                    <div w-class="normalTitle">
                        持有({{v.unitPrice}}/份)
                    </div>
                    <div w-class="normalMain">
                        <span>{{v.amount}}</span>
                        <span w-class="unit">份</span>
                    </div>
                </div>
                <span w-class="iconLine"></span>
                <div w-class="mainMid">
                    <div w-class="normalTitle">
                        昨日收益(ETH)
                    </div>
                    <div w-class="incomMain">
                        {{v.yesterdayIncoming}}<span w-class="unit"></span>
                    </div>
                </div>
                <span w-class="iconLine"></span>
                <div w-class="mainRight">
                    <div w-class="normalTitle">
                        累计
                    </div>
                    <div w-class="normalMain">
                        {{v.days}}<span w-class="unit">天</span>
                    </div>
                </div>
            </div>
        </div>
        {{end}}
        
        {{end}}
    


    <div w-class="currentProduct">
        活期理财
    </div>
    <div w-class="productList">

        {{for i,v of it1.productList}}
        <div w-class="productItem" on-tap="toDetail({{i}})">
            <div w-class="productHead">
                <span w-class="productItemHeadTitle">
                    {{v.title}} 
                </span>
                <div w-class="ring-container">
                    <app-components_level_1-ringProgressBar-ringProgressBar>{
                        "width":120,
                        "borderWidth":15,
                        "activeColor":"#e5e5e5",
                        "bgColor":"#a0acc0",
                        "activePercent":{{1 - v.surplus / v.total}},
                        "centerStyle":"fontSize:28px;color:#111;",
                        "centerText":{{v.surplus === 0 ? '售罄' : Math.floor(v.surplus / v.total * 100) + '%' }}}
                    </app-components_level_1-ringProgressBar-ringProgressBar>
                </div>
            </div>
            <div w-class="productInfo">
                <div w-class="interestRate">
                    <div w-class="rate">{{v.profit}}</div>
                    <div w-class="rateTitle">预期年化收益</div>
                </div>
                <div w-class="infoMain">
                    <div w-class="mainTitle">
                        {{v.productName}}
                    </div>
                    <div w-class="mainText">
                        {{v.productDescribe}}
                    </div>
                </div>
            </div>
        </div>
        {{end}}
    </div>

    <div style="height: 120px;"></div>

</div>