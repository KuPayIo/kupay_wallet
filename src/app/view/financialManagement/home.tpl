<div class="ga-new-page hide-scrollbar" w-class="ga-new-page" style="overflow-y: auto;overflow-x: hidden;"> 
    <div>
    <app-components-topBar-topBar>{title:"理财",iconColor:"white"}</app-components-topBar-topBar>
    <div w-class="ga-announcement-container">
        <img src="../../res/image/icon_speaker.png" w-class="ga-speaker-icon"/>
        <span w-class="ga-speaker-title">{{'[头条]'}}</span>
        <span w-class="ga-speaker-text">医药行情风头正盛，分享享政策红利</span>
    </div>
    <div w-class="ga-carousel-container" class="swiper-container" >
        <div w-class="swiper-wrapper" class="swiper-wrapper">
            {{for index,item of it1.bannerList}}
            <div w-class="swiper-slide" class="swiper-slide" style="background-image:url(../../res/image/{{item}});"></div>
            {{end}}
        </div>
        <div class="swiper-pagination"></div>
    </div>
    <div w-class="ga-other-function">
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
    </div>
    <div w-class="ga-line"></div>
    <div w-class="ga-fund-container">
        <div w-class="ga-box1">
            <span w-class="ga-fund-title">人气类别</span>
            <span w-class="ga-fund-desc">全网数据 投基风向标</span>
        </div>
        <div w-class="ga-fund-list">
            {{for index,item of it1.popularFunds}}
            <div w-class="ga-fund-list-item {{index === it1.popularFunds.length - 1 ? 'ga-fund-list-item-border' : ''}}" on-tap="popularFundItemClick(e,{{index}})">
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
</div>