<div w-class="base" class="hide-scrollbar">
    <div w-class="header" title="36px" ev-back-click="doClose">
        <app-components-topBar-topBar>{title:{{it1.currency1+'/'+it1.currency2}}}</app-components-topBar-topBar>
        <div w-class="k-line" on-tap="showKLine"></div>
    </div>
    <div w-class="menu" ev-tabs-change="onMenuChange">
        <app-components-tabs-tabsNormal>{list:{{it1.list}},activeNum:{{it1.activeNum}} } </app-components-tabs-tabsNormal>
    </div>
    {{if it1.activeNum===0||it1.activeNum===1}}
    <div w-class="body-business" style="overflow-y: auto;overflow-x: hidden;height: 1100px;">
        <div w-class="body-business-left">
            <div w-class="limit-text">
                <span>限价{{it1.activeNum===0?'买入':'卖出'}}</span>
            </div>
            <div w-class="color-show">
                <div w-class="buy-color"></div>
                <div w-class="buy-color-text">买</div>
                <div w-class="sale-color"></div>
                <div w-class="sale-color-text">卖</div>
            </div>
            <div w-class="input-price">
                <app-components-input-input_border>{input:{{it1.price}},placeHolder:"价格"}</app-components-input-input_border>
            </div>
            <div w-class="price-less"></div>
            <div w-class="price-add"></div>
            <div w-class="price-conversion">
                <span>{{it1.priceConversion}}</span>
            </div>
            <div w-class="input-count">
                <app-components-input-input_border>{input:{{it1.count}},placeHolder:{{it1.countHolder}},style:"padding: 0px 100px 0px 20px;"}</app-components-input-input_border>
                <div w-class="count-currency">{{it1.currency1}}</div>
            </div>
            <div w-class="count-use">可用
                <span>0.00{{it1.activeNum===0?it1.currency1:it1.currency2}}</span>
                <span style="position: relative;left: 130px;color: #1A70DD;">充值</span>
            </div>
            <div w-class="count-slider" ev-slider-change="onSlicerChange">
                <pi-components-slider-slider>{value:{{it1.usePercent}},min:0,max:100}</pi-components-slider-slider>
                <span>{{it1.usePercent}}%</span>
            </div>
            <span w-class="all_text">交易额</span>
            <div w-class="input-all">
                <app-components-input-input_border>{input:{{it1.all}},placeHolder:{{it1.allCountHolder}},style:"padding: 0px 100px 0px 20px;"}</app-components-input-input_border>
                <div w-class="count-currency">{{it1.currency2}}</div>
            </div>
            <div w-class="btn-buy-currency">{{it1.activeNum===0?'买入':'卖出'}}{{it1.currency1}}</div>
        </div>
        <div w-class="body-business-right">
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
            <span w-class="average">{{it1.average}}</span>
            <div w-class="average-price">{{it1.averagePrice}}</div>
            <div w-class="line" style="top: 100px;"></div>
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
        </div>
        <div w-class="line" style="width: 100%;top: 160px;"></div>
        <div w-class="foot-business">
            <div w-class="transfer-title">
                <div w-class="transfer-time">时间</div>
                <div w-class="transfer-price">价格</div>
                <div w-class="transfer-count">数量</div>
            </div>
            {{if it1.transferList}}
            <div w-class="transfer-info">
                {{for i,each of it1.transferList}}
                <div w-class="each-transfer">
                    <div w-class="transfer-time">{{each.time}}</div>
                    <div w-class="transfer-price">{{each.price}}</div>
                    <div w-class="transfer-count">{{each.count}}</div>
                </div>
                {{end}}
            </div>
            {{else}}
            <div w-class="transfer-info-none">暂无数据</div>
            {{end}}
        </div>
    </div>
    {{else}}
    <div w-class="body-entrust" style="overflow-y: auto;overflow-x: hidden;height: 1100px;">
        {{for i,each of it1.entrustList}}
        <div w-class="each-entrust">
            {{if each.type===1}}
            <div w-class="entrust-type" style="color: rgba(0, 189, 154, 1);">买入</div>
            {{else}}
            <div w-class="entrust-type" style="color: rgba(255, 105, 96, 1);">卖出</div>
            {{end}}
            <div w-class="entrust-currency">{{each.currency1}}/{{each.currency2}}</div>
            <div w-class="entrust-status">委托中</div>
            <div w-class="entrust-time">{{each.time}}</div>
            {{if it1.activeNum===2}}
            <div w-class="entrust-cancel" on-tap="doCancel(e,{{each.id}})">撤销</div>
            {{end}}
            <div w-class="entrust-title">
                <div w-class="entrust-price">价格</div>
                <div w-class="entrust-currency1">{{each.currency1}}</div>
                <div w-class="entrust-currency2">{{each.currency2}}</div>
            </div>
            <div w-class="entrust-body">
                <div w-class="entrust-price">{{each.price}}</div>
                <div w-class="entrust-currency1">{{each.currencyCount1}}</div>
                <div w-class="entrust-currency2">{{each.currencyCount2}}</div>
            </div>
            <div w-class="line" style="top: 295px;width: 100%;"></div>
        </div>
        {{end}}
    </div>
    {{end}}
</div>