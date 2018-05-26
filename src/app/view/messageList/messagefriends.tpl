{{let talkcontent = it1.data1}}
{{if it.content=="2"}}
    {{: talkcontent = it1.data2}}
{{end}}
<div class="ga-new-page" style="background-color: #f9f9f9;">
    <div w-class="ga-top-banner">
        <img src="../../res/image/btn_back.png" w-class="ga-back" on-tap="backPrePage"/>
        <span style="text-align: center;">
            <span w-class="messFriendName">{{it.name}}</span>
            <div w-class="messFriendAddr">ETH asdfasdg...fhadfhasf</div>
        </span>
    </div>
    <div w-plugin='{"mod":"pi/widget/scroller/scroller", "options":{"startY":-819} }' w-class="talkContent"  >
        <div style="height: auto;" id="talkcontent">
            {{for ind,val of talkcontent}}
                {{if val.time}}
                    <div w-class="messFriendTime">{{val.time}}</div>
                {{end}}
                {{if val.type=="1"}}
                    <div style="overflow:auto;">
                        <div style="text-align: right;" w-class="messFriendPerson">我</div>
                        <div w-class="mymessContent">{{val.content}}</div>
                        <span style="clear: both;"></span>
                    </div>
                {{else}}
                    <div style="overflow:auto;">
                        <div w-class="messFriendPerson">{{it.name}}</div>
                        <div w-class="friendmessContent">{{val.content}}</div>
                    </div>
                {{end}}
            {{end}}
        </div>
    </div>  
    <div w-class="talkInput">
        <div w-class="inputDiv"><app-components-input-input>{}</app-components-input-input></div>
        
        <img src="../../res/image/icon_mine_send.png" w-class="sendBtn"/>
    </div>
</div>