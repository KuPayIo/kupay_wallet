<div class="new-page" w-class="new-page" on-tap="doClose">
    <div w-class="main">
        <div w-class="title"><pi-ui-lang>{"zh_Hans":"矿工费","zh_Hant":"礦工費","en":""}</pi-ui-lang></div>
        <div w-class="list-container">
            {{for i,v of it.minerFeeList}}
            <div w-class="list-item" on-tap="chooseMinerLevel(e,{{i}})">
                <div w-class="item-left">
                    {{if typeof(v.time) === 'string'}}
                        {{v.time}}
                    {{else}}
                        <pi-ui-lang>{{v.time}}</pi-ui-lang>
                    {{end}}
                    
                    ：{{v.minerFee}}&nbsp;{{it.currencyName}}
                </div>
                <div w-class="item-right">
                    {{if typeof(v.text) ==='string' }}
                        {{v.text}}
                    {{else}}    
                        <pi-ui-lang>{{v.text}}</pi-ui-lang>
                    {{end}}
                </div>
                {{if v.level === it.level}}
                <img src="../../res/image/right.png" w-class="choosed"/>
                {{end}}
            </div>
            {{end}}
        </div>
    </div>
</div>