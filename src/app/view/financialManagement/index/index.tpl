<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="headStatusBar"></div>
    <div w-class="head" on-tap="toRecord">
        <span w-class="headTitle">我的理财</span>
        <img src="../../../res/image/cloud_arow_right.png" w-class="headArow" />
    </div>


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
                        {{v.bonus}}<span w-class="unit"></span>
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
                {{if v.isSoldOut}}
                <span w-class="surplus soldOut">
                    售罄
                </span>
                {{else}}
                <span w-class="surplus" style="background: repeating-linear-gradient(to right,#1A70DD 0%, #1A70DD {{v.surplus}}, #a0acc0 0%,#a0acc0 101%);">
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