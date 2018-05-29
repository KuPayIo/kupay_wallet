<div w-class="base" class="hide-scrollbar" style="overflow-y: auto;overflow-x: hidden;">
    <div style="height: 1420px;">
        <div w-class="header">
            <span w-class="currency" on-tap="changeCurrency">{{it1.currency1}}/{{it1.currency2}}</span>
            <span w-class="currency-change" on-tap="changeCurrency">
            </span>
            <div w-class="k-line" on-tap="showKLine">
            </div>
        </div>
        <div w-class="body">
            <div w-class="body-left">
                <div w-class="btn-buy {{it1.isSelect==='buy'?'is-select':''}}" on-tap="clkBuy">买入</div>
                <div w-class="btn-sale {{it1.isSelect!=='buy'?'is-select':''}}" on-tap="clkSale">卖出</div>
                <div w-class="limit-text">
                    <span>限价{{it1.isSelect==='buy'?'买入':'卖出'}}</span>
                </div>
                <div w-class="color-show">
                    <div w-class="buy-color"></div>
                    <div w-class="buy-color-text">买</div>
                    <div w-class="sale-color"></div>
                    <div w-class="sale-color-text">卖</div>
                </div>
                <div w-class="input-price">
                    <app-components-input-input>{input:{{it1.price}},disabled:true}</app-components-input-input>
                </div>
                <div w-class="price-conversion">
                    <span>{{it1.priceConversion}}</span>
                </div>
                <div w-class="input-count">
                    <app-components-input-input>{input:{{it1.count}},disabled:true}</app-components-input-input>
                </div>

                <div w-class="input-all">
                    <app-components-input-input>{input:{{it1.all}},disabled:true}</app-components-input-input>
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