<div w-class="item" on-tap="productItemClick">
    <div w-class="row1">
        <div>{{it.product.productName}}</div>
        <div w-class="status {{it.stateBg}}">{{it.stateShow}}</div>
    </div>
    <div w-class="row2">
        <div w-class="col">
            {{: tips = [
                {"zh_Hans":"持有","zh_Hant":"持有","en":""},
                {"zh_Hans":"份","zh_Hant":"份","en":""},
                {"zh_Hans":"昨日收益","zh_Hant":"昨日收益","en":""},
                {"zh_Hans":"累计","zh_Hant":"累計","en":""},
                {"zh_Hans":"天","zh_Hant":"天","en":""}] }}


            <div w-class="tag">
                <pi-ui-lang>{{tips[0]}}</pi-ui-lang>
                (  {{it.product.unitPrice}} / 
                <pi-ui-lang>{{tips[1]}}</pi-ui-lang>   )
            </div>
            <div w-class="tag1">
                {{it.product.amount}}
                <pi-ui-lang>{{tips[1]}}</pi-ui-lang>
            </div>
        </div>
        <div w-class="col">
            <div w-class="tag">
                <pi-ui-lang>{{tips[2]}}</pi-ui-lang>
                ( {{it.product.coinType}} )
            </div>
            <div w-class="tag2">{{it.product.yesterdayIncoming}}</div>
        </div>
        <div w-class="col">
            <div w-class="tag"><pi-ui-lang>{{tips[3]}}</pi-ui-lang></div>
            <div w-class="tag1">
                {{it.product.days}}
                <pi-ui-lang>{{tips[4]}}</pi-ui-lang>
            </div>
        </div>
    </div>
</div>