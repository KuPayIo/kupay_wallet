<div class="ga-new-page" ev-back-click="backPrePage" w-class="ga-new-page">
    <app-components-topBar-topBar>{title:"红包记录",iconColor:"white",style:"color:#fff;backgroundColor:#DF5E5E;"}</app-components-topBar-topBar>
    <div w-class="ga-body"> 
        <div w-class="ga-records-num">
            <span w-class="ga-num">{{it1.sendNumber}}</span>
            <span w-class="ga-tag">发出红包</span>
        </div>
        <div w-class="ga-records-list-box">
            <div w-class="ga-records-list-title">未被领取的红包已退回云端账户</div>
            <div w-class="ga-records-list" on-scroll="getMoreList" id="records-container">
                <div id="records">
                    {{for index,item of it1.recordList}}
                    <div w-class="ga-records-item" on-tap="redEnvelopeItemClick(e,{{index}})">
                        <div w-class="ga-records-left">
                            <span w-class="ga-records-type">{{item.rtype === 0 ? '等额红包' : "随机红包"}}</span>
                            <span w-class="ga-records-time">{{item.timeShow}}</span>
                        </div>
                        <div w-class="ga-amount"><span>{{item.amount}}</span>&nbsp;<span>{{item.ctypeShow}}</span></div>
                    </div>
                    {{end}}
                    <div w-class="loadmore" id="more">{{it1.hasMore ? '加载中，请稍后~~~' : '没有更多了'}}</div>
                </div>
            </div>
        </div>
    </div>
</div>