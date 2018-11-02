<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
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
                    <img w-class="sub" on-down="minus" src="../../../res/image/less_blue.png"/>
                    <span>{{it1.amount}}</span>
                    <img w-class="plus" on-down="add" src="../../../res/image/add.png" />
                </div>
            </div>
            <div w-class="read" on-tap="readAgree">{{it1.cfgData.readAgree}}</div>
            <div ev-btn-tap="purchaseClicked" w-class="btn"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName}},"types":"big","color":"blue"}</app-components1-btn-btn></div>
        </div>
    </div>
    {{let opca = it1.scrollHeight/200}}
    <div w-class="ga-top-banner" style="{{it1.scroll?'background:rgba(255, 255, 255, '+ opca +');border-bottom: 1px solid #cccccc;':'background:transparent;'}}">
        <div w-class="left-container">
            <img on-tap="backPrePage" src="../../../res/image/{{it1.scroll ? 'left_arrow_blue.png' : 'left_arrow_white.png'}}" w-class="ga-back" />
            <span on-tap="backPrePage"  style="color: {{it1.scroll ? '#222':'#fff'}}">{{it.product.productName}}</span>
        </div>
    </div>
</div>