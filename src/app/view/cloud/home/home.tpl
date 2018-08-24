<div class="ga-new-page" w-class="ga-new-page">
    
    <div w-class="accountInfo">
        <div w-class="ktInfo" on-tap="cloudAccountClicked">
            <span w-class="growAccountName">
                我的云账户
            </span>
            <span w-class="ktBalance">
                {{it1.ktBalance}}KT
            </span>
            <img src="../../../res/image/cloud_arow_right.png" />
        </div>
    </div>

    <div w-class="myEthInfo">
        <div w-class="myethTitle" on-tap="bonusClicked">
            累计分红(ETH)
            <img src="../../../res/image/cloud_arow_right2.png" w-class="arowR2" />
        </div>
        <div w-class="myethBonusAmount" on-tap="bonusClicked">
                {{it1.bonus}}
        </div>
        <div w-class="myethAmount">
                持有 {{it1.ethBalance}} ETH
        </div>
    </div>

    <div w-class="canvas" style="display: none;">
        <div w-class="canvasHead">
            <div w-class="canvasHead-left">
                <div w-class="leftTitle">
                    <span w-class="KTspan">KT</span>/ETH</div>
                <div w-class="leftMain">交易量 2652125.624</div>
            </div>
            <div w-class="canvasHead-mid">
                <div w-class="midTitle">0.000000109</div>
                <div w-class="midMain">￥106,088.98</div>
            </div>
            <span w-class="canvasHead-right">
                -2.63%
            </span>
        </div>
        <div w-class="canvasContainer">

        </div>
    </div>




    <div w-class="activity">
        <div w-class="activityItem" on-tap="mining">
            <img src="../../../res/image/cloud_others_drag.png" w-class="activityIcon" />
            <div w-class="activityInfo">
                <div w-class="infoTitle">
                    每日挖矿
                </div>
                <div w-class="infoMain">
                    {{if it1.isAbleBtn}} 本次可挖{{it1.mines}}KT {{else}} 拥有1000KT才能提现 {{end}}
                </div>
            </div>
            <span w-class="paddingSpan" style="display: {{it1.isAbleBtn?'inline':'none'}}" on-tap="doPadding">
                挖一下
            </span>
            <img src="../../../res/image/cloud_arow_right3.png" />
        </div>

        <div w-class="activityItem" on-tap="inviteRedEnvelopeClick">
            <img src="../../../res/image/cloud_others_getETH.png" w-class="activityIcon" />
            <div w-class="activityInfo">
                <div w-class="infoTitle">
                    领取0.5个ETH
                </div>
                <div w-class="infoMain">
                    分享邀请红包给好友，共享0.5ETH
                </div>
            </div>

            <img src="../../../res/image/cloud_arow_right3.png" />
        </div>
        <div w-class="activityItem" on-tap="packetsClicked">
            <img src="../../../res/image/cloud_others_redPocket.png" w-class="activityIcon" />
            <div w-class="activityInfo">
                <div w-class="infoTitle">
                    发红包
                </div>
                <div w-class="infoMain">
                    发红包给好友
                </div>
            </div>

            <img src="../../../res/image/cloud_arow_right3.png" />
        </div>
        <div w-class="activityItem" on-tap="awardsClicked">
            <img src="../../../res/image/cloud_others_award.png" w-class="activityIcon" />
            <div w-class="activityInfo">
                <div w-class="infoTitle">
                    兑换领奖
                </div>
                <div w-class="infoMain">
                    使用兑换码开礼包
                </div>
            </div>

            <img src="../../../res/image/cloud_arow_right3.png" />
        </div>
    </div>
    <div style="height: 120px;">

    </div>
</div>