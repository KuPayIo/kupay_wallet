<div class="ga-new-page" w-class="index">
    <div w-class="topBar">
        理财
    </div>
    <div w-class="assetsDetail">
        <div w-class="flexItem boxBorderRight" on-tap="assestsClicked">
            <img src="../../../res/image/btn_right_arrow.png" w-class="arrow" />
            <p w-class="assetsTitle">持有资产（MPT）</p>
            <p w-class="assetsContent">{{it1.assets}}</p>
        </div>
        <div w-class="flexItem" on-tap="incomeClicked">
            <img src="../../../res/image/btn_right_arrow.png" w-class="arrow" />
            <p w-class="assetsTitle">累计收益</p>
            <p w-class="assetsContent">{{it1.cumulativeIncome}}</p>
        </div>
    </div>
    <div w-class="productList">
        <div w-class="listTitle">
            热门推荐
        </div>
        {{for i,v of it1.productList}}
        <div w-class="listItems" on-tap="toDetail">
            <div w-class="listflexleft">
                <p w-class="expectedEarnings">{{v.expectedEarnings}}</p>
                <p w-class="tip">{{v.tip}}</p>
            </div>
            <div w-class="listflexright">
                <div>
                    <p w-class="title">{{v.title}}</p>
                    {{if v.isSellOut}}
                    <span w-class="tag">售罄</span>
                    {{end}}
                </div>
                <p w-class="describe">
                    {{v.content}}
                </p>
            </div>
        </div>
        {{end}}

    </div>
</div>