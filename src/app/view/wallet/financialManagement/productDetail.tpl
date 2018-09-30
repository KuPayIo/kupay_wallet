<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{if !it1.isScroll}}
    <app-components1-topBar-topBar>{"title":{{it.product.productName}},background:"linear-gradient(to right,#328EE6, #38CEE7);"}</app-components1-topBar-topBar>
    {{else}}
    <app-components1-topBar-topBar>{"title":{{it.product.productName}}}</app-components1-topBar-topBar>
    {{end}}
    <div w-class="body" on-scroll="pageScroll" id="body">
        <div w-class="top-head">
            <div w-class="row1">
                <div w-class="col1">
                    <div w-class="desc">{{it1.cfgData.profit}}</div>
                    <div w-class="content">{{it.product.profit}}%</div>
                </div>
                <div w-class="col2">
                    <div w-class="desc">{{it1.cfgData.days}}</div>
                    <div w-class="content">{{it.product.days}}</div>
                </div>
            </div>
            <div w-class="row2">{{it1.cfgData.mess}}</div>
            <div w-class="row3"><div w-class="progress" style="width:{{it1.usePercent}}%;"></div></div>
            <div w-class="row4">
                <div style="width:{{it1.usePercent}}%;"></div>
                <div w-class="sold" >{{it1.cfgData.tips[0]}}&nbsp;{{it1.usePercent}}%</div>
            </div>
        </div>
    
        <div w-class="bottom-box">
            <div w-class="row5">{{it.product.productIntroduction}}</div>
            <div w-class="title">{{it1.cfgData.tips[1]}}</div>
            <div w-class="detail-box">
                <div w-class="detail">{{it1.cfgData.detail[0] + it.product.unitPrice}}&nbsp;{{it.product.coinType + "/" + it1.cfgData.tips[4]}}</div>
                <div w-class="detail">{{it1.cfgData.detail[1] + it1.leftPercent}}%</div>
                <div w-class="detail">{{it1.cfgData.detail[2]}}</div>
            </div>
            <div w-class="unit">
                <span>{{it1.cfgData.tips[2]}}</span>
                <div w-class="limit"><span>（</span><span w-class="limit-number">{{it1.cfgData.tips[3] + it.product.limit + it1.cfgData.tips[4]}}</span><span>）</span></div>
            </div>
            <div w-class="select-num">
                <span w-class="unit-price">
                    {{it.product.unitPrice}}&nbsp;{{it.product.coinType}}
                </span>
                <div w-class="right-box">
                    <img w-class="sub" on-tap="minus" src="../../../res/image/less.png"/>
                    <span>{{it1.amount}}</span>
                    <img w-class="plus" on-tap="add" src="../../../res/image/add_gray.png" />
                </div>
            </div>
            <div w-class="read" on-tap="readAgree">{{it1.cfgData.readAgree}}</div>
            <div ev-btn-tap="purchaseClicked" w-class="btn"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName}},"types":"big","color":"blue"}</app-components1-btn-btn></div>
        </div>
    </div>
</div>