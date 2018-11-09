<div w-class="historylist" id="historylist" on-scroll="getMoreList">

    <div w-class="history">
        <div w-class="item">
            <span w-class="itemRank">{{it.myRank}}</span>
            <img src="{{it1.userImg}}"  w-class="itemImg"/>
            <div style="display: inline-block;flex: 1 0 0;">
                <div w-class="itemName"><pi-ui-lang>{"zh_Hans":"我","zh_Hant":"我","en":""}</pi-ui-lang></div>
                {{if it.fg==1}}
                <div w-class="itemDescribe"><pi-ui-lang>{"zh_Hans":"矿山总量","zh_Hant":"礦山總量","en":""}</pi-ui-lang>
                    {{it1.totalNum+" "}} KT
                </div>
                {{else}}
                <div w-class="itemDescribe"><pi-ui-lang>{"zh_Hans":"挖矿","zh_Hant":"挖礦","en":""}</pi-ui-lang>
                    {{it1.totalNum+" "}} KT
                </div>
                {{end}}
            </div>
        </div>
        {{: leftTitle = {"zh_Hans":"矿山总量","zh_Hant":"礦山總量","en":""} }}
        {{: rightTitle = {"zh_Hans":"挖矿","zh_Hant":"挖礦","en":""} }}

        {{for ind,val of it1.data}}
            {{let desc = it.fg==1? leftTitle : rightTitle}}
            {{let rank = val.index}}
            
            {{if rank<10}}
                {{: rank="00"+rank}}
            {{elseif rank<100}}
                {{: rank="0"+rank}}
            {{end}}
            <app-components-imgRankItem-imgRankItem>{"name":{{val.name}},"describe":{{desc}},"descNumber":{{val.num+" KT"}},"img":{{val.avatar?val.avatar:"../../res/image/default_miningList.png"}},"rank":{{rank}} }</app-components-imgRankItem-imgRankItem>
        {{end}}

        {{if it1.data.length>0 && !it1.more}}
        <div w-class="endMess"><pi-ui-lang>{"zh_Hans":"到此结束啦","zh_Hant":"到此結束啦","en":""}</pi-ui-lang>^_^</div>
        {{end}}

        {{if it1.data.length==0}}
        <div w-class="historyNone">
            <img src="../../../res/image/dividend_history_none.png" style="width: 200px;height: 200px;"/>
            <div><pi-ui-lang>{"zh_Hans":"还没有记录哦","zh_Hant":"還沒有記錄哦","en":""}</pi-ui-lang></div>
        </div>
        {{end}}
    </div>    
    
</div>