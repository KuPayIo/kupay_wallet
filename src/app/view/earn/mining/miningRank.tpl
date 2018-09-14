<div w-class="historylist" id="historylist" on-scroll="getMoreList">

    <div w-class="history">
        <div w-class="item">
            <span w-class="itemRank">1</span>
            <img src="../../../res/image/addMine_create.png" w-class="itemImg"/>
            <div style="display: inline-block;flex: 1 0 0;">
                <div w-class="itemName">我</div>
                {{if it.fg==1}}
                <div w-class="itemDescribe">矿山总量{{it1.totalNum+" "}} KT</div>
                {{else}}
                <div w-class="itemDescribe">挖矿{{it1.totalNum+" "}} KT</div>
                {{end}}
            </div>
        </div>
        {{for ind,val of it1.data}}
            {{let desc = it.fg==1?"矿山总量":"挖矿"}}
            {{let rank = val.index}}
            
            {{if rank<10}}
                {{: rank="00"+rank}}
            {{elseif rank<100}}
                {{: rank="0"+rank}}
            {{end}}
            <app-components-imgRankItem-imgRankItem>{"name":{{val.name}},"describe":{{desc+val.num+" KT"}},"img":"../../res/image/addMine_create.png","rank":{{rank}} }</app-components-imgRankItem-imgRankItem>
        {{end}}

        {{if it1.data.length>0 && !it1.more}}
        <div w-class="endMess">到此结束啦^_^</div>
        {{end}}

        {{if it1.data.length==0}}
        <div w-class="historyNone">
            <img src="../../../res/image/dividend_history_none.png" style="width: 200px;height: 200px;"/>
            <div>还没有记录哦</div>
        </div>
        {{end}}
    </div>    
    
</div>