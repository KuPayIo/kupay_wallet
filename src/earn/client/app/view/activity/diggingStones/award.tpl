<div class="new-page" w-class="new-page" ev-back-click="backClick">
    <app-components1-topBar-topBar>{"title":{zh_Hans:"活动奖励",zh_Hant:"活動獎勵",en:""}}</app-components1-topBar-topBar>
    <div w-class="body">
        <div>
            <div w-class="box1">
                <div w-class="cumulative-login">
                    <div w-class="cumulative-login-inner">
                        <span w-class="cumulative-days">3</span><span>天</span>
                    </div>
                </div>
                <div w-class="cumulative-login-tip">累计登录</div>
            </div>
            <div w-class="btns">
                <div w-class="btn {{it.activeNumber === 0 ? 'btn-blue color-white' : 'btn-gray color-black'}} mr15" on-tap="switchAward(e,{{0}})">登录礼</div>
                <div w-class="btn {{it.activeNumber !== 0 ? 'btn-blue color-white' : 'btn-gray color-black'}}" on-tap="switchAward(e,{{1}})">邀请礼</div>
            </div>
            {{if it.activeNumber === 0}}
            <div w-class="award-gifts">
                {{for i of [0,0,0,0,0,0,0,0,0]}}
                <app-view-activity-components-awardGift style="margin-top:50px;">{"width":180,"borderWidth":8,"activeColor":"#F7931A","activePercent":0.4,"centerImage":"../../../res/image/award_gold_hoe.png",firstText:"1/2",secondText:"每日登录"}</app-view-activity-components-awardGift>
                {{end}}
            </div>
            {{else}}
            <div w-class="award-gifts">
                {{for i of [0,0,0,0,0,0,0,0,0]}}
                <app-view-activity-components-awardGift style="margin-top:50px;">{"width":180,"borderWidth":8,"activeColor":"#F7931A","activePercent":0.4,"centerImage":"../../../res/image/award_gold_hoe.png",firstText:"1-3人"}</app-view-activity-components-awardGift>
                {{end}}
            </div>
            {{end}}
        </div>
    </div>
</div>