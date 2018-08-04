<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="headStatusBar"></div>
    <div w-class="head" on-tap="toRecord">
        <span w-class="headTitle">我的理财</span>
        <span w-class="headTip">全部</span>
        <img src="../../../res/image/cloud_arow_right.png" w-class="headArow" />
    </div>

    <div w-class="mine">
        {{for i,v of it1.record}}
        <div w-class="mineItem">
            <div w-class="mineTitle">
                {{v.title}}
            </div>
            <div w-class="mineMain">
                <div w-class="mainLeft">
                    <div w-class="normalTitle">
                        持有(0.01/份)
                    </div>
                    <div w-class="normalMain">
                        {{v.amount}}份
                    </div>
                </div>
                <div w-class="mainMid">
                    <div w-class="normalTitle">
                        昨日收益(ETH)
                    </div>
                    <div w-class="incomMain">
                        {{v.bonus}}
                    </div>
                </div>
                <div w-class="mainRight">
                    <div w-class="normalTitle">
                        累计
                    </div>
                    <div w-class="normalMain">
                        {{v.days}}天
                    </div>
                </div>
            </div>
        </div>
        {{end}}

        <div w-class="more" on-tap="toRecord">
            更多
        </div>
    </div>


    <div w-class="currentProduct">
        活期理财
    </div>
    <div w-class="productList">

        {{for i,v of it1.productList}}
        <div w-class="productItem" on-tap="toDetail">
            <div w-class="productHead">
                {{v.title}} 
                {{if v.isSoldOut}}
                <span w-class="surplus soldOut">
                    售罄
                </span>
                {{else}}
                <span w-class="surplus">
                    剩余{{v.surplus}}
                </span>
                {{end}}

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