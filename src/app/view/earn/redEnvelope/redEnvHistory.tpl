<div class="new-page" w-class="new-page">

    <div w-class="content" on-scroll="getMoreList" id="redEnvHistory">
        <img src="../../../res/image/redEnvtop1.png" w-class="topBackimg" />
        <div id="historyRecords" w-class="records">

            <div w-class="topBack">
                <img src="../../../res/image/default_avater_big.png" w-class="userHead" />
                <div style="margin-top: 20px;">
                    <pi-ui-lang>{"zh_Hans":"共发出","zh_Hant":"共發出","en":""}</pi-ui-lang>
                </div>
                <div style="margin-bottom: 90px;"><span style="font-size: 64px;">{{it1.sendNumber}}</span>
                    <pi-ui-lang>{"zh_Hans":"个红包","zh_Hant":"個紅包","en":""}</pi-ui-lang>
                </div>
            </div>
            <div w-class="bottom">
                {{if it1.recordList.length==0}}
                    <div style="text-align: center;height: 100%;">
                        <img src="../../../res/image/redEnvEmpty.png" style="width: 200px;height: 200px;margin-top: 210px;" />
                        <div style="font-size: 32px;color: #888888;margin-top: 20px;">
                        <pi-ui-lang>{"zh_Hans":"试试发一个红包","zh_Hant":"試試發一個紅包","en":""}</pi-ui-lang></div>
                    </div>
                {{else}}
                    <div w-class="tips">
                        <pi-ui-lang>{"zh_Hans":"24小时未被领取的红包已退回云账户","zh_Hant":"24小時未被領取的紅包已退回雲賬戶","en":""}</pi-ui-lang>
                    </div>
                    {{for ind,val of it1.recordList}}
                    <div on-tap="goDetail({{ind}})">
                        {{let desc = {"zh_Hans":val.curNum+"/"+val.totalNum + "个","zh_Hant":val.curNum+"/"+val.totalNum + "個","en":""} }}
                        {{let outDate = {"zh_Hans":"已过期","zh_Hant":"已過期","en":""} }}	
                        {{let rtypeShow = [{"zh_Hans":"普通红包","zh_Hant":"普通紅包","en":""},{"zh_Hans":"拼手气红包","zh_Hant":"拼手氣紅包","en":""},{"zh_Hans":"邀请红包","zh_Hant":"邀請紅包","en":""}] }}

                        <app-components-fourParaItem-fourParaItem>
                            {name:{{rtypeShow[val.rtype]}},data:{{val.amount+" "+val.ctypeShow}},time:{{val.timeShow}},describe:{{val.outDate ? outDate :desc}} }
                        </app-components-fourParaItem-fourParaItem>
                    </div>
                    {{end}}
                {{end}}

                {{if it1.showMoreTips && it1.recordList.length>0}}
                <div w-class="endMess" id="more"><pi-ui-lang>{"zh_Hans":"到此结束啦","zh_Hant":"到此結束啦","en":""}</pi-ui-lang>^_^</div>
                {{end}}

            </div>

        </div>
    </div>

    {{let opca = it1.scrollHeight/100}}
    <div w-class="ga-top-banner" style="{{it1.scroll?'background:rgba(255, 255, 255, '+ opca +');border-bottom: 2px solid #cccccc;':'background:transparent;'}}">
        <div w-class="left-container">
            <img on-tap="backPrePage" src="../../../res/image/{{it1.scroll ? 'left_arrow_blue.png' : 'left_arrow_white.png'}}" w-class="ga-back" />
            <span on-tap="backPrePage" style="color: {{it1.scroll ? '#222':'#fff'}}">
                <pi-ui-lang>{"zh_Hans":"红包记录","zh_Hant":"紅包記錄","en":""}</pi-ui-lang>
            </span>
        </div>
        <img on-tap="refreshPage" src="../../../res/image1/{{it1.scroll?'refresh_blue.png':'refresh_white.png'}}"
            w-class="refreshBtn" class="{{it1.topRefresh?'refreshing':''}}" />
    </div>
</div>