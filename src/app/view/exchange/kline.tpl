<div w-class="base">
    <div w-class="header">
        <div on-tap="backPrePage" w-class="ga-back-container">
            <img src="../../res/image/btn_back.png" w-class="ga-back" />
        </div>
        <span w-class="currency" on-tap="changeCurrency">{{it1.currency1}}/{{it1.currency2}}</span>
        <span w-class="currency-change" on-tap="changeCurrency"></span>
    </div>
    <div style="background-color: white;height: 1190px;overflow: hidden;" w-plugin='{"mod":"pi/widget/scroller/scroller", "options":{} }'>
        <div style="height: 1480px;">
            <div w-class="body-text">
                <span w-class="body-text-title" style="margin-left: 0px;">开</span>
                <span w-class="body-text-value">{{it1.open}}</span>
                <span w-class="body-text-title">收</span>
                <span w-class="body-text-value">{{it1.close}}</span>
                <span w-class="body-text-title">成交</span>
                <span w-class="body-text-value">{{it1.done}}</span>
                <br></br>
                <span w-class="body-text-title" style="margin-left: 0px;">高</span>
                <span w-class="body-text-value">{{it1.high}}</span>
                <span w-class="body-text-title">低</span>
                <span w-class="body-text-value">{{it1.low}}</span>
                <br></br>
                <span style="color: #203260;">{{it1.time}}</span>
            </div>
            <div style="position: relative;right: 30px;top: -83px;">
                <div style="position: absolute;right: 0px;font-size: 36px;color: #203260;">{{it1.blance}}</div>
                <div style="right: 0px;position: absolute;font-size: 24px;color: #EE6560;top: 40px;">{{it1.up}}</div>
                <div style="position: absolute;top: 70px;right: 30px;width: 120px;">
                    <div w-class="buy-color"></div>
                    <div w-class="buy-color-text">买</div>
                    <div w-class="sale-color"></div>
                    <div w-class="sale-color-text">卖</div>
                </div>
            </div>
            <div style="position: relative;top: 40px;">
                <img width="750" src="../../res/image/img_K@2x.jpg" />
            </div>
            <div style="position: relative;top: 40px;width: 100%;height: 1000px;">
                <div style="font-size: 24px;color: #0B0817;background: #E5E5EE;">
                    <div style="display: inline-block;margin-left: 30px;">买入量</div>
                    <div style="display: inline-block;margin-left: 250px;">价格</div>
                    <div style="display: inline-block;margin-left: 250px;">卖出量</div>
                </div>
                <div style="font-size: 28px;">
                    {{for i,each of it1.list}}
                    <div style="position: relative;height: 40px;">
                        <div style="left: 30px;color: #0B0817;position: absolute;">{{each.buyCount}}</div>
                        <div style="text-align: right;position: absolute;color: rgb(0, 189, 154);left: 155px;width: 200px;">{{each.buyPrice}}</div>
                        <div style="position: absolute;left: 367px;color: #FF6960;">{{each.salePrice}}</div>
                        <div style="position: absolute;right: 30px;color: #0B0817;">{{each.saleCount}}</div>
                    </div>
                    {{end}}
                </div>

            </div>
        </div>
    </div>
</div>