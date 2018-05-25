<div class="ga-new-page" w-class="ga-new-page"  w-plugin='{"mod":"pi/widget/scroller/scroller", "options":{} }'>
<div>
    <div w-class="ga-header">
        <div w-class="ga-top-banner">
            <div on-tap="backPrePage" w-class="ga-back-container">
                <img src="../../../res/image/btn_back_white.png" w-class="ga-back" />
            </div>
            <div w-class="ga-title-container">
                <span w-class="ga-banner-title">生物/医疗健康</span>
                <span w-class="ga-number">501009</span>
            </div>
            <div w-class="ga-share-container" on-tap="fundShareClick">
                <img src="../../../res/image/btn_fund_share.png" w-class="ga-share" />
            </div>
        </div>
        <div w-class="ga-header-content-container">
            <div w-class="ga-header-top">
                <div w-class="ga-header-left">
                    <span w-class="ga-header-h">单位净值(USDT)</span>
                    <span w-class="ga-header-p">1.6920</span>
                </div>
                <div w-class="ga-header-right">
                    <span w-class="ga-header-h">日涨跌(%)</span>
                    <span w-class="ga-header-p">+3.16</span>
                </div>
            </div>
            <div w-class="ga-header-bottom">
                <span w-class="ga-header-label">中高风险</span>
                <span w-class="ga-header-label">成长型</span>
                <span w-class="ga-header-label">1000USDT起购</span>
            </div>
        </div>
    </div>

    <div w-class="ga-charts-container">
        <div w-class="ga-charts-title">累计净值走势图</div>
        <div w-class="ga-charts" style="background-image: url(../../../res/image/{{it1.chartsImgs[it1.showChartsIndex]}});"></div>
        <div w-class="ga-charts-btns">
            <div w-class="ga-charts-btn1 {{it1.showChartsIndex === 0 ? 'ga-charts-btn-active' : ''}}" on-tap="chartsSwitchClick(e,{{0}})">一月</div>
            <div w-class="ga-charts-btn2 {{it1.showChartsIndex === 1 ? 'ga-charts-btn-active' : ''}}" on-tap="chartsSwitchClick(e,{{1}})">三月</div>
            <div w-class="ga-charts-btn3 {{it1.showChartsIndex === 2 ? 'ga-charts-btn-active' : ''}}" on-tap="chartsSwitchClick(e,{{2}})">半年</div>
            <div w-class="ga-charts-btn4 {{it1.showChartsIndex === 3 ? 'ga-charts-btn-active' : ''}}" on-tap="chartsSwitchClick(e,{{3}})">一年</div>
        </div>
    </div>
    <div w-class="ga-line8"></div>
    <div w-class="ga-history-container">
        <div w-class="ga-history-box">
            <div w-class="ga-history-performance-btn">历史业绩</div>
            <div w-class="ga-history-net-worth-btn">历史净值</div>
        </div>
        <div w-class="ga-his-box">
            <span>时间区间</span>
            <span>涨跌幅</span>
        </div>
        {{for index,item of it1.historyPerformances}}
        <div w-class="ga-his-box">
            <span w-class="ga-his-date">{{item.date}}</span>
            <span w-class="ga-his-change">{{item.change}}</span>
        </div>
        {{end}}
    </div>
    <div w-class="ga-line16"></div>
    <div w-class="ga-other-list">
        {{for index,item of it1.otherFundItem}}
        <div w-class="ga-other-list-item">
            <span>{{item}}</span>
            <img src="../../../res/image/btn_right_arrow.png" w-class="ga-arrow"/>
        </div>
        <div w-class="ga-line8"></div>
        {{end}}
        <div w-class="ga-line16"></div>
    </div>
    <div w-class="ga-bottom-btn"></div>
</div>
</div>