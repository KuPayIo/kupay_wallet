<div class="ga-new-page" ev-back-click="backPrePage" w-class="ga-new-page">
    <app-components-topBar-topBar>{title:"兑换记录"}</app-components-topBar-topBar>
    <div w-class="ga-body"> 
        <div w-class="ga-records-num">
            <span w-class="ga-num">2</span>
            <span w-class="ga-tag">兑换红包</span>
        </div>
        <div w-class="ga-records-list-box">
            <div w-class="ga-records-list-title">未被领取的红包已退回云端账户</div>
            <div w-class="ga-records-list">
                <div>
                    {{for index,item of it1.recordList}}
                    <div w-class="ga-item">
                        <img src="../../../res/image/img_avatar1.png" w-class="ga-avator"/>
                        <div w-class="ga-item-right">
                            <div w-class="ga-box1">
                                <div w-class="ga-type">{{item.rtype === 0 ? '等额红包' : '随机红包'}}</div>
                                <div>{{item.amount}}&nbsp;{{item.ctypeShow}}</div>
                            </div>
                            <div w-class="ga-box2">
                                <div w-class="ga-time">{{item.timeShow}}</div>
                            </div>
                        </div>
                    </div>
                    {{end}}
                </div>
            </div>
        </div>
    </div>
</div>