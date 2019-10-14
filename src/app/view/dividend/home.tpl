<div w-class="newPage" class="new-page"  ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"分红","zh_Hant":"分紅","en":""} }}
    <app-components-topBar-topBar>{title:{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="body">
        <div w-class="dividendBox">
            <div w-class="available">{{it.title}}</div>
            <div w-class="holdSt">
                <div w-class="ST">{{it.dividendAmount.num}}</div>
                <div w-class="skMark">{{it.dividendAmount.about}}</div>
            </div>
            <div w-class="holdKt">
                <div w-class="left">
                    <div w-class="title" style="border-right: 1px solid white; padding-right:40px;">持有嗨豆</div>
                    <div w-class="num" style="border-right: 1px solid white; padding-right:40px;">{{it.hold.kt}}</div>
                </div>
                <div w-class="right">
                    <div w-class="title">累计分红 mBTC</div>
                    <div w-class="num">{{it.hold.addUp}}</div>
                </div>
            </div>
            <div w-class="bottom">下次分红时间：{{it.time}}</div>
        </div>
        <div w-class="problem">
            {{for i,v of it.dividendInterest}}
                <div w-class="item" on-down="onShow" on-tap="click({{i}})">
                    <div>{{v}}</div>
                    <img src="../../res/image/right_arrow2_gray.png" alt="" w-class="img"/>
                </div>
            {{end}}
        </div>
        <div w-class="btn">
            <div style="display: flex;justify-content: space-around;">
                <div w-class="btn1" on-down="onShow">赚嗨豆</div>
                <div w-class="btn2" on-down="onShow">领分红</div>
            </div>
        </div>
    </div>
</div>