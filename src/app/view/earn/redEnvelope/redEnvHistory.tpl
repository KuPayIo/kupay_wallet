<div class="new-page" ev-back-click="backPrePage">
    {{if !it1.scroll}}
    <app-components1-topBar-topBar>{"title":"红包记录",background:"#F46262" }</app-components1-topBar-topBar>
    {{else}}
    <app-components1-topBar-topBar>{"title":"红包记录"}</app-components1-topBar-topBar>
    {{end}}
    <div w-class="content" on-scroll="pageScroll" id="content">
        <img src="../../../res/image/redEnvtop1.png" w-class="topBackimg"/>
        
        <div w-class="topBack">
            <img src="../../../res/image/default_avater_big.png" w-class="userHead"/>
            <div style="margin-top: 20px;">共发出</div>
            <div><span style="font-size: 64px;">0</span>个红包</div>
        </div>
        <div w-class="bottom">
            {{if it1.list.length==0}}
                <div style="text-align: center;">
                    <img src="../../../res/image/redEnvEmpty.png" style="width: 200px;height: 200px;margin-top: 210px;"/>
                    <div style="font-size: 32px;color: #888888;margin-top: 20px;">试试发一个红包</div>
                </div>
            {{else}}
                <div w-class="tips">过期未被领取的红包已退回云端账户</div>
                {{for ind,val of it1.list}}
                    <app-components-fourParaItem-fourParaItem>{{val}}</app-components-fourParaItem-fourParaItem>
                {{end}}
            {{end}}

            {{if it1.list.length>0 && !it1.more}}
            <div w-class="endMess">到此结束啦^_^</div>
            {{end}}

        </div>
        
        <div style="height: 128px;"></div>
        
    </div>
</div>