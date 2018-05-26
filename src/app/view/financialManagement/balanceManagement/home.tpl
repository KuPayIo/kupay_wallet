<div class="ga-new-page" w-class="ga-new-page" >
<div w-plugin='{"mod":"pi/widget/scroller/scroller", "options":{} }' style="height:1334px;">
<div w-class="ga-inner-page">
    <div w-class="ga-header" ev-back-click="goBackClick">
        <app-components-topBar-topBar>{title:"币投宝",style:"background-color:transparent;color:#fff;",iconColor:"white"}</app-components-topBar-topBar>
        <div w-class="ga-header-content-container">    
            <div w-class="ga-bill-container">
                <span w-class="ga-title">昨日收益(USDT)</span>
                <span w-class="ga-costs">0.0001</span>
                <span w-class="ga-balance">总金额***USDT</span>
            </div>
            <div w-class="ga-bill-msg">
                <span w-class="ga-item">
                    <span w-class="ga-item-1">累计收益(USDT)</span>
                    <span w-class="ga-item-2">0.1720</span>
                </span>
                <span w-class="ga-item">
                    <span w-class="ga-item-1">万份收益(USDT)</span>
                    <span w-class="ga-item-2">1.0299</span>
                </span>
                <span w-class="ga-item" style="border-right:1px solid transparent;">
                    <span w-class="ga-item-1">七年日化(%)</span>
                    <span w-class="ga-item-2">3.8960</span>
                </span>
            </div>
        </div>
    </div>
    <div w-class="ga-fund-container">
        <div w-class="ga-box1">
            <span w-class="ga-fund-title">优选基金</span>
            <span w-class="ga-fund-desc">长线投资 专家精选</span>
        </div>
        <div w-class="ga-fund-list">
            {{for index,item of it1.preferredFunds}}
            <div w-class="ga-fund-list-item {{index === it1.preferredFunds.length - 1 ? 'ga-fund-list-item-border' : ''}}" on-tap="preferredFundItemClick(e,{{index}})">
                <div w-class="ga-fund-row1">
                    <div w-class="ga-fund-per">
                        <span w-class="ga-fund-per-value">{{item.per}}</span>
                        <span>%</span>
                    </div>
                    <div w-class="ga-fund-name">{{item.name}}</div>
                </div>
                <div w-class="ga-fun-row2">
                    <span w-class="ga-fund-date">{{item.date}}</span>
                    <span w-class="ga-fund-begin">{{item.MinInvestment}}&nbsp;USDT起投</span>
                </div>
            </div>
            {{end}}
        </div>
        <div w-class="ga-line"></div>
        <div w-class="ga-bottom-list">
            <div w-class="ga-list-item" on-tap="projectIntroductionClick">
                <img src="../../../res/image/icon_fund_Introduce.png" w-class="ga-list-item-icon"/>
                <div w-class="ga-list-item-text">项目介绍</div>
                <img src="../../../res/image/btn_right_arrow.png" w-class="ga-list-item-arrow"/>
            </div>
            <div w-class="ga-list-item" on-tap="commonProblemClick">
                <img src="../../../res/image/icon_fund_ques.png" w-class="ga-list-item-icon"/>
                <div w-class="ga-list-item-text">常见问题</div>
                <img src="../../../res/image/btn_right_arrow.png" w-class="ga-list-item-arrow"/>
            </div>
        </div>
    </div>
</div>
</div>
<div w-class="ga-btns">
    <div w-class="ga-btn-item ">转出</div>
    <div w-class="ga-btn-item ga-btn-active">存入</div>
</div>
</div>