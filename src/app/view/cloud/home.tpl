<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="statusBar"></div>
    <div w-class="headBar" on-tap="cloudAccountClicked">

        <div w-class="flexLeft">
            <img src="../../res/image/cloud_cointype_btc.png" w-class="coinIcon" />
            <span w-class="accountBalance">
                5,000.00 KPT
            </span>
        </div>
        <div w-class="flexRight">
            <img src="../../res/image/cloud_cointype_eth.png" w-class="coinIcon" />
            <span w-class="accountBalance">
                0.522 ETH
            </span>
            <img src="../../res/image/cloud_arow_right.png" w-class="arowIcon" />
        </div>

    </div>
    <div w-class="bonusBox">
        <img src="../../res/image/cloud_bonus.png" w-class="bonusIcon" />累计分红(ETH)

        <span w-class="rightFloat">
            <span w-class="bonusAmount">
                0.9152
            </span>
            <img src="../../res/image/cloud_arow_right.png" w-class="bonusArowIcon" />
        </span>


    </div>
    <div w-class="bonusBox">
        <img src="../../res/image/cloud_others_drag.png" style="width: 38px;height: 38px;" w-class="bonusIcon" />挖矿(KT)

        <span w-class="rightFloat">
            <span w-class="linerBg">
                挖一下
            </span>
            <img src="../../res/image/cloud_arow_right.png" w-class="bonusArowIcon" />
        </span>


    </div>

    <div w-class="market">
        <div w-class="itemLeft">
            <div w-class="marketItem">
                <span w-class="exchangeType">
                    MPT
                    <span style="color: rgba(142, 150, 171, 0.87);">/ETH</span>
                </span>
                <span w-class="exchangeRate">
                    {{it1.exchangeRate}}
                </span>
            </div>
            <div w-class="marketItem itembot">
                <span w-class="transactionVolume">
                    交易量 {{it1.totalDeal}}
                </span>
                <span w-class="YNC">
                    {{it1.totalDealYNC}}
                </span>
            </div>
        </div>
        <div w-class="itemRight">
            <div style="position: relative; top: 50%;transform: translateY(-50%);">
                <div w-class="increase">
                    {{it1.increase}}
                </div>
            </div>
        </div>
    </div>

    <div w-class="kLineContainer" on-tap="toTradingPlaces">

    </div>

    <div w-class="service">
        <div w-class="title">
            服务
        </div>
        <div w-class="functions">
            <div w-class="funcItems">
                <div w-class="imgBox">
                    <img src="../../res/image/cloud_packets.png" w-class="img" />
                </div>
                <div w-class="text">
                    发红包
                </div>
            </div>

            <div w-class="funcItems">
                <div w-class="imgBox">
                    <img src="../../res/image/cloud_awards.png" w-class="img" />
                </div>
                <div w-class="text">
                    兑换领奖
                </div>
            </div>
            <div w-class="funcItems">
                <div w-class="imgBox">
                    <img src="../../res/image/cloud_bonus.png" w-class="img" />
                </div>
                <div w-class="text">
                    领分红
                </div>
            </div>

            <div w-class="funcItems">
                <div w-class="imgBox">
                    <img src="../../res/image/cloud_friends.png" w-class="img" />
                </div>
                <div w-class="text">
                    邀请好友
                </div>
            </div>



        </div>
    </div>

    <div style="width: 100%;height: 110px;margin-top:10px; ">

    </div>
</div>