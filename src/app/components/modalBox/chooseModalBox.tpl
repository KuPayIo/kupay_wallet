<div class="new-page" w-class="new-page" on-tap="doClose">
    <div w-class="main">
        <div w-class="title">{{it1.cfgData.title}}</div>
        <div w-class="list-container">
            {{for i,v of it1.minerFeeList}}
            <div w-class="list-item" on-tap="chooseMinerLevel(e,{{i}})">
                <div w-class="item-left">{{v.time}}：{{v.minerFee}}&nbsp;{{it.currencyName}}</div>
                <div w-class="item-right">{{v.text}}</div>
                {{if v.level === it1.level}}
                <img src="../../res/image/right.png" w-class="choosed"/>
                {{end}}
            </div>
            {{end}}
        </div>
    </div>
</div>