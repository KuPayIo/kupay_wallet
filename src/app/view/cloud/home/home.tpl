<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="headStatusBar"></div>
    <div w-class="accountInfo">
        <div w-class="ktInfo" on-tap="cloudAccountClicked">
            <span w-class="growAccountName">
                我的云账户
            </span>
            <img src="../../../res/image/cloud_cointype_eth.png" w-class="ktIcon" />
            <span w-class="ktBalance">
                {{it1.ktBalance}}
            </span>
            <img src="../../../res/image/cloud_arow_right.png" />
        </div>
        <div w-class="ethInfo">
            <div w-class="ethHoldings">
                <div>
                    <img src="../../../res/image/cloud_bonus.png" w-class="bonusIcon" />
                    <span w-class="ethText">
                        当前持有（ETH）
                    </span>
                </div>
                <div w-class="possession">
                    {{it1.ethBalance}}
                </div>
            </div>
            <span w-class="line"></span>
            <div w-class="totalBonus">
                <div>
                    <img src="../../../res/image/cloud_bonus.png" w-class="bonusIcon" />
                    <span w-class="ethText">
                        累计分红(ETH)
                        <span w-class="fontArow">▶</span>
                    </span>
                </div>
                <div w-class="possession">
                    {{it1.bonus}}
                </div>
            </div>
        </div>
    </div>

    <div w-class="canvas">
        <div w-class="canvasHead">
            <div w-class="canvasHead-left">
                <div w-class="leftTitle"><span w-class="KTspan">KT</span>/ETH</div>
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
        <div w-class="activityItem">
            <img src="../../../res/image/cloud_others_drag.png" w-class="activityIcon" />
            <div w-class="activityInfo">
                <div w-class="infoTitle">
                    每日挖矿
                </div>
                <div w-class="infoMain">
                    本次可挖6300KT
                </div>
            </div>
            <span w-class="paddingSpan">
                挖一下
            </span>
            <img src="../../../res/image/cloud_arow_right.png" />
        </div>

        <div w-class="activityItem">
            <img src="../../../res/image/cloud_others_drag.png" w-class="activityIcon" />
            <div w-class="activityInfo">
                <div w-class="infoTitle">
                    领取0.5个ETH
                </div>
                <div w-class="infoMain">
                    分享邀请红包给好友，共享0.5ETH
                </div>
            </div>

            <img src="../../../res/image/cloud_arow_right.png" />
        </div>
    </div>


    <div w-class="service">
        <div w-class="serviceHead">
            服务
        </div>
        <div w-class="serviceBox">
            <div w-class="serviceItem" on-tap="packetsClicked">
                <img src="../../../res/image/cloud_others_pockets.png" w-class="serviceIcon" />
                <div>
                    <div w-class="serviceTitle">发红包</div>
                    <div w-class="serviceMain">发红包给好友</div>
                </div>
            </div>

            <div w-class="serviceItem" on-tap="awardsClicked">
                <img src="../../../res/image/cloud_others_pockets.png" w-class="serviceIcon" />
                <div>
                    <div w-class="serviceTitle">兑换领奖</div>
                    <div w-class="serviceMain">使用兑换码</div>
                </div>
            </div>
        </div>
    </div>

    <div style="height: 120px;">

    </div>
</div>