<div class="new-page" ev-back-click="backPrePage">
    {{if !it1.isScroll}}
    <app-components1-topBar-topBar>{"title":"红包记录",background:"#F46262" }</app-components1-topBar-topBar>
    {{else}}
    <app-components1-topBar-topBar>{"title":"红包记录"}</app-components1-topBar-topBar>
    {{end}}
    <div w-class="content" on-scroll="pageScroll" id="content">
        <img src="../../../res/image/redEnvtop1.png" w-class="topBackimg"/>
        <div id="records">
        
            <div w-class="topBack">
                <img src="../../../res/image/default_avater_big.png" w-class="userHead"/>
                <div style="margin-top: 20px;">共发出</div>
                <div><span style="font-size: 64px;">{{it1.sendNumber}}</span>个红包</div>
            </div>
            <div w-class="bottom">
                {{if it1.recordList.length==0}}
                    <div style="text-align: center;">
                        <img src="../../../res/image/redEnvEmpty.png" style="width: 200px;height: 200px;margin-top: 210px;"/>
                        <div style="font-size: 32px;color: #888888;margin-top: 20px;">试试发一个红包</div>
                    </div>
                {{else}}
                    <div w-class="tips">过期未被领取的红包已退回云端账户</div>
                    {{for ind,val of it1.recordList}}
                    <div on-tap="goDetail({{ind}})">
                        <app-components-fourParaItem-fourParaItem>{name:{{val.rtype==0?'普通红包':'拼手气红包'}},data:{{val.amount+" "+val.ctypeShow}},time:{{val.timeShow}},describe:{{val.curNum+"/"+val.totalNum+"个"}} }</app-components-fourParaItem-fourParaItem>
                    </div>
                    {{end}}
                {{end}}

                {{if it1.showMoreTips}}
                <div w-class="endMess" id="more">到此结束啦^_^</div>
                {{end}}

            </div>
            
            <div style="height: 128px;"></div>

        </div>
    </div>
</div>