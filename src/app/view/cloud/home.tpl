<div class="ga-new-page">
    <div w-class="statusBar"></div>
    <div w-class="headBar">
        <div w-class="innerDiv" on-tap="cloudAccountClicked">
            <span w-class="accountTitle">
                我的云账户
            </span>
            <span w-class="rightFloat">
                <span w-class="accountBalance">
                    {{it1.cloudBalance}}
                </span>
                <img src="../../res/image/cloud_arow_right.png" w-class="icon" />
            </span>
        </div>
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
            <div w-class="funcItems" on-tap="packetsClicked">
                <div w-class="imgBox">
                    <img src="../../res/image/cloud_packets.png" w-class="img" />
                </div>
                <div w-class="text">
                    发红包
                </div>
            </div>

            <div w-class="funcItems" on-tap="awardsClicked">
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
</div>