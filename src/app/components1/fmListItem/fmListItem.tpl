<div w-class="item">
    <div w-class="inner1">
        <div w-class="gain"><span w-class="gain-number">{{it.product.profit}}</span><span w-class="gain-unit">%</span></div>
        <div w-class="desc"><pi-ui-lang>{"zh_Hans":"预计年化收益","zh_Hant":"預期年化收益","en":""}</pi-ui-lang></div>
    </div>
    <div w-class="inner2">
        <div w-class="name">{{it.product.productName}}</div>
        <div w-class="desc">{{it.product.productDescribe}}</div>
    </div>

    
    {{if it.product.surplus === 0 }}
        {{: centerText = {"zh_Hans":"售罄","zh_Hant":"售罄","en":""} }}
    {{else}}
        {{: centerText = Math.floor(it.product.surplus / it.product.total * 100) + '%' }}
    {{end}}
    <app-components-ringProgressBar-ringProgressBar>
        {
            "width":80,
            "borderWidth":4,
            "activeColor":"#f48e35",
            "activePercent":{{1 - it.product.surplus / it.product.total}},
            "centerStyle":"fontSize:28px;color:#f7931a;",
            "centerText":{{centerText}}
        }
    </app-components-ringProgressBar-ringProgressBar>
</div>