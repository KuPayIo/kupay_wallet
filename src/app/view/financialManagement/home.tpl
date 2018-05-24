<div class="ga-new-page" w-class="ga-new-page">
    <app-components-topBar-topBar>{title:"理财",iconColor:"white"}</app-components-topBar-topBar>
    <div w-class="ga-announcement-container">
        <img src="../../res/image/icon_speaker.png" w-class="ga-speaker-icon"/>
        <span w-class="ga-speaker-title">{{'[头条]'}}</span>
        <span w-class="ga-speaker-text">医药行情风头正盛，分享享政策红利</span>
    </div>
    <div w-class="ga-carousel-container">
        <div w-class="ga-carousel-title">连续12月正收益</div>
        <div w-class="ga-carousel-text">理财投资的好选择</div>
        <div w-class="ga-dots">
            <span w-class="ga-dot ga-dot-active"></span>
            <span w-class="ga-dot"></span>
            <span w-class="ga-dot"></span>
        </div>
    </div>
    <div w-class="ga-other-function">
        <div w-class="ga-function-item" on-tap="fundClick">
            <img src="../../res/image/icon_fund.png" w-class="ga-function-item-icon"/>
            <span w-class="ga-function-item-text">基金</span>
        </div>
        <div w-class="ga-function-item" on-tap="balanceManagementClick">
            <img src="../../res/image/icon_eggmoney.png" w-class="ga-function-item-icon"/>
            <span w-class="ga-function-item-text">币投宝</span>
        </div>
        <div w-class="ga-function-item" on-tap="loanClick">
            <img src="../../res/image/icon_loan.png" w-class="ga-function-item-icon"/>
            <span w-class="ga-function-item-text">币币贷</span>
        </div>
    </div>
    <div w-class="ga-line"></div>
    <div w-class="ga-fund-container">
        <div w-class="ga-box1">
            <span w-class="ga-fund-title">优选基金</span>
            <span w-class="ga-fund-desc">长线投资 专家精选</span>
        </div>
        <div w-class="ga-fund-list">
            <div w-class="ga-fund-list-item">
                <div w-class="ga-fund-row1">
                    <div w-class="ga-fund-per">
                        <span w-class="ga-fund-per-value">27.24</span>
                        <span>%</span>
                    </div>
                    <div w-class="ga-fund-name">生物/医疗健康</div>
                </div>
                <div w-class="ga-fun-row2">
                    <span w-class="ga-fund-date">近一年</span>
                    <span w-class="ga-fund-begin">1,000 USDT起投</span>
                </div>
            </div>
            <div w-class="ga-fund-list-item ga-fund-list-item-border">
                <div w-class="ga-fund-row1">
                    <div w-class="ga-fund-per">
                        <span w-class="ga-fund-per-value">25.76</span>
                        <span>%</span>
                    </div>
                    <div w-class="ga-fund-name">基础链</div>
                </div>
                <div w-class="ga-fun-row2">
                    <span w-class="ga-fund-date">近一年</span>
                    <span w-class="ga-fund-begin">10 USDT起投</span>
                </div>
            </div>
        </div>
    </div>
    <div w-class="ga-line"></div>
    <div w-class="ga-fund-container">
        <div w-class="ga-box1">
            <span w-class="ga-fund-title">优选基金</span>
            <span w-class="ga-fund-desc">长线投资 专家精选</span>
        </div>
        <div w-class="ga-fund-list">
            <div w-class="ga-fund-list-item">
                <div w-class="ga-fund-row1">
                    <div w-class="ga-fund-per">
                        <span w-class="ga-fund-per-value">27.24</span>
                        <span>%</span>
                    </div>
                    <div w-class="ga-fund-name">生物/医疗健康</div>
                </div>
                <div w-class="ga-fun-row2">
                    <span w-class="ga-fund-date">近一年</span>
                    <span w-class="ga-fund-begin">1,000 USDT起投</span>
                </div>
            </div>
            <div w-class="ga-fund-list-item ga-fund-list-item-border">
                <div w-class="ga-fund-row1">
                    <div w-class="ga-fund-per">
                        <span w-class="ga-fund-per-value">25.76</span>
                        <span>%</span>
                    </div>
                    <div w-class="ga-fund-name">基础链</div>
                </div>
                <div w-class="ga-fun-row2">
                    <span w-class="ga-fund-date">近一年</span>
                    <span w-class="ga-fund-begin">10 USDT起投</span>
                </div>
            </div>
        </div>
    </div>
    <div w-class="ga-line"></div>
    <div w-class="ga-news-container">
        <div w-class="ga-news-box">
            <span w-class="ga-news-h">资讯视点</span>
            <span w-class="ga-news-p">新闻早知道</span>
        </div>
        <div w-class="ga-news-list">
            {{for index,news of it1.newsList}}
            <div w-class="ga-news-item">
                <span w-class="ga-news-title">{{news.title}}</span>
                <span w-class="ga-news-time">{{news.time}}</span>
            </div>
            {{end}}
        </div>
    </div>

</div>