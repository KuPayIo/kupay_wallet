<div w-class="item">
    <div w-class="inner1">
        <div w-class="gain"><span w-class="gain-number">{{it.product.profit}}</span><span w-class="gain-unit">%</span></div>
        <div w-class="desc">{{it1.cfgData.title}}</div>
    </div>
    <div w-class="inner2">
        <div w-class="name">{{it.product.productName}}</div>
        <div w-class="desc">{{it.product.productDescribe}}</div>
    </div>
    <app-components-ringProgressBar-ringProgressBar>
        {
            "width":80,
            "borderWidth":4,
            "activeColor":"#f48e35",
            "activePercent":{{1 - it.product.surplus / it.product.total}},
            "centerStyle":"fontSize:28px;color:#f7931a;",
            "centerText":{{it.product.surplus === 0 ? it1.cfgData.saleOut : Math.floor(it.product.surplus / it.product.total * 100) + '%' }}
        }
    </app-components-ringProgressBar-ringProgressBar>
</div>