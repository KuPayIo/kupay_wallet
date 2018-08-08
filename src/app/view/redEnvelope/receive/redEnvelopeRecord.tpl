<div class="ga-new-page" ev-back-click="backPrePage" w-class="ga-new-page">
    <app-components-topBar-topBar>{title:"兑换记录"}</app-components-topBar-topBar>
    <div w-class="ga-body"> 
        <div w-class="ga-records-num">
            <span w-class="ga-num">{{it1.convertNumberShow}}</span>
            <span w-class="ga-tag">兑换红包</span>
        </div>
        <div w-class="ga-records-list-box">
            <div w-class="ga-records-list-title">未被领取的红包已退回云端账户</div>
            <div w-class="ga-records-list" on-scroll="getMoreList" id="records-container">
                <div id="records">
                    {{for index,item of it1.recordListShow}}
                    <div w-class="ga-item">
                        <img src="../../../res/image/img_avatar1.png" w-class="ga-avator"/>
                        <div w-class="ga-item-right">
                            <div w-class="ga-box1">
                                <div w-class="ga-type">{{item.rtypeShow}}</div>
                                <div w-class="ga-amount">{{item.amount}}&nbsp;{{item.ctypeShow}}</div>
                            </div>
                            <div w-class="ga-box2">
                                <div w-class="ga-time">{{item.timeShow}}</div>
                            </div>
                        </div>
                    </div>
                    {{end}}
                    {{if it1.showMoreTips}}
                    <div w-class="loadmore" id="more">{{it1.hasMore ? '加载中，请稍后~~~' : '没有更多了'}}</div>
                    {{end}}
                </div>
            </div>
        </div>
    </div>
</div>