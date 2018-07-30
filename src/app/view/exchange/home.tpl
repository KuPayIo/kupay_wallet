<div w-class="base" class="hide-scrollbar" style="overflow-y: auto;overflow-x: hidden;">
    <div style="height: 1420px;">
        <div w-class="header">
            <span w-class="currency" on-tap="changeCurrency">{{it1.currency1}}/{{it1.currency2}}</span>
            <span w-class="currency-change" on-tap="changeCurrency">
            </span>
            <div w-class="k-line" on-tap="showKLine">
            </div>
        </div>
        <div w-class="menu">
            <pi-components-tabs-tabs>{list:{{it1.list}},activeNum:{{it1.activeNum}} } </pi-components-tabs-tabs>
        </div>
        <div w-class="body">
            <div w-class="body-left">
                <div w-class="input-price">
                    <app-components-input-input_border>{input:{{it1.price}}}</app-components-input-input_border>
                </div>
                <div>-</div>
                <div>+</div>
                <div w-class="price-conversion">
                    <span>{{it1.priceConversion}}</span>
                </div>
                <div w-class="input-count">
                    <app-components-input-input>{input:{{it1.count}}}</app-components-input-input>
                </div>
                <div>可用
                    <span>0.00BTC</span>
                </div>
                <div>
                    <pi-components-slider-slider>{value:5,min:0,max:100}</pi-components-slider-slider>
                    <span>5%</span>
                </div>
                <span>交易额</span>
                <div w-class="input-all">
                    <app-components-input-input>{input:{{it1.all}}}</app-components-input-input>
                </div>
                <div w-class="btn-buy-currency">{{it1.isSelect==='buy'?'买入':'卖出'}}{{it1.currency1}}</div>
            </div>
            <div w-class="body-right">
                <span w-class="show-tip">4位小数</span>
                <div w-class="line" style="top: 30px;"></div>
                <div w-class="title">
                    <span w-class="title-price">价格({{it1.currency2}})</span>
                    <span w-class="title-count">数量({{it1.currency1}})</span>
                </div>
                <div w-class="buy-list">
                    {{for i,each of it1.buyList}}
                    <div w-class="each-buy">
                        <div w-class="buy-price">{{each.price}}</div>
                        <div w-class="buy-count">{{each.count}}</div>
                        <div w-class="buy-schedule">
                            <div w-class="buy-schedule-bar" style="width: {{each.schedule*100}}%"></div>
                        </div>
                    </div>
                    {{end}}
                </div>
                <div w-class="line" style="top: 80px;"></div>
                <div w-class="sale-list">
                    {{for i,each of it1.saleList}}
                    <div w-class="each-sale">
                        <div w-class="sale-price">{{each.price}}</div>
                        <div w-class="sale-count">{{each.count}}</div>
                        <div w-class="sale-schedule">
                            <div w-class="sale-schedule-bar" style="width: {{each.schedule*100}}%"></div>
                        </div>
                    </div>
                    {{end}}
                </div>
                <span w-class="all-conversion">{{it1.allConversion}}</span>
                <div w-class="change" on-tap="showKLine">{{it1.change}}</div>
            </div>
        </div>
        <div w-class="foot">
            <div w-class="foot-title">当前委托</div>
            <div w-class="foot-info">暂无数据</div>
        </div>
    </div>
</div>