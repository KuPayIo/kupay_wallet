<div w-class="base">
    <div w-class="header">
        <span w-class="currency">{{it1.currency1}}/{{it1.currency2}}</span>
        <span w-class="currency-change" on-tap="changeCurrency">
        </span>
        <div w-class="k-line" on-tap="showKLine">
        </div>
    </div>
    <div w-class="body">
        <div w-class="body-left">
            <div w-class="btn-buy {{it1.isSelect==='buy'?'is-select':''}}" on-tap="clkBuy">买入</div>
            <div w-class="btn-sale {{it1.isSelect!=='buy'?'is-select':''}}" on-tap="clkSale">卖出</div>
            <div>
                <span>限价{{it1.isSelect==='buy'?'买入':'卖出'}}</span>
            </div>
            <div>
                <div w-class="buy-color"></div>
                <div>买</div>
                <div w-class="sale-color"></div>
                <div>卖</div>
            </div>
            <div>
                <pi-components-input-input>{input:{{it1.price}},disabled:true}</pi-components-input-input>
            </div>
            <div>
                <span>{{it1.priceConversion}}</span>
            </div>
            <div>
                <pi-components-input-input>{input:{{it1.count}},disabled:true}</pi-components-input-input>
            </div>

            <div>
                <pi-components-input-input>{input:{{it1.all}},disabled:true}</pi-components-input-input>
            </div>
            <div>{{it1.isSelect==='buy'?'买入':'卖出'}}{{it1.currency1}}</div>
        </div>
        <div w-class="body-right">
            <span>4位小数</span>
            <div w-class="line"></div>
            <div>
                <span>价格({{it1.currency2}})</span>
                <span>数量({{it1.currency1}})</span>
            </div>
            <div>
                {{for i,each of it1.buyList}}
                <div w-class="each-buy">
                    <div w-class="buy-price">{{each.price}}</div>
                    <div w-class="buy-count">{{each.count}}</div>
                    <div w-class="buy-schedule">
                        <div style="width: {{each.count*100}}%"></div>
                    </div>
                </div>
                {{end}}
            </div>
            <div w-class="line"></div>
            <div>
                {{for i,each of it1.saleList}}
                <div w-class="each-sale">
                    <div w-class="sale-price">{{each.price}}</div>
                    <div w-class="sale-count">{{each.count}}</div>
                    <div w-class="sale-schedule">
                        <div style="width: {{each.count*100}}%"></div>
                    </div>
                </div>
                {{end}}
            </div>
            <div>{{it1.allConversion}}</div>
            <div>{{it1.change}}</div>
        </div>
    </div>
    <div w-class="foot">
        <div>当前委托</div>
        <div>暂无数据</div>
    </div>
</div>