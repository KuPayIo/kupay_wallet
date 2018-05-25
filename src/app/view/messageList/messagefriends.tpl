<div class="ga-new-page" style="background-color: #f9f9f9;">
    <div w-class="ga-top-banner">
        <img src="../../res/image/btn_back.png" w-class="ga-back" on-tap="backPrePage"/>
        <span style="text-align: center;">
            <span w-class="messFriendName">{{it.name}}</span>
            <div w-class="messFriendAddr">ETH asdfasdg...fhadfhasf</div>
        </span>
    </div>
    <div style="background-color: #f9f9f9;height: 100%;">
        {{for ind,val of it1.data}}
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
    <div w-class="talkInput">
        <input type="text" w-class="inputDiv"/>
        <img src="../../res/image/icon_mine_send.png" w-class="sendBtn"/>
    </div>
</div>