{{let item = it1.list[it1.selected]}}
<div class="new-page" style="background: #F2F2F2;" ev-back-click="backPrePage" ev-next-click="goHistory">
    <app-components1-topBar-topBar>{"title":"发红包",nextImg:"../../res/image/26_white.png",background:"#F46262;"}</app-components1-topBar-topBar>

    <div w-class="content" ev-selectBox-change="changeCoin">
        <app-components-selectBox-selectBox>{list:{{it1.list}},selected:{{it1.selected}} }</app-components-selectBox-selectBox>
        <div style="font-size: 28px;color: #888888;margin: 30px;">每个红包金额固定，改为
            <span style="color: #3988E8;" on-tap="changePin">{{it1.showPin?'普通红包':'拼手气红包'}}</span>
        </div>
        <div ev-input-change="changeAmount">
            <app-components-basicInput-basicInput>{prepend:{{it1.showPin?'总金额':'单个金额'}},placeholder:"0",itype:"number",append:{{item.name}},isShowPin:{{it1.showPin}} }</app-components-basicInput-basicInput>
        </div>
        <div style="margin: 10px 0;" ev-input-change="changeNumber">
            <app-components-basicInput-basicInput>{prepend:"红包个数",placeholder:"0",itype:"number",append:"个" }</app-components-basicInput-basicInput>
        </div>
        <div style="margin: 10px 0;">
            <app-components-basicInput-basicInput>{prepend:"留言",placeholder:"恭喜发财 万事如意",maxLength:20 }</app-components-basicInput-basicInput>
        </div>
        <div w-class="totalNum">{{it1.totalAmount+" "+item.name}}</div>
        <div style="margin: 0 40px;" ev-btn-tap="send">
            <app-components-btn-btn>{"name":"塞钱进红包","types":"big","style":"background:#F46262;"}</app-components-btn-btn>
        </div>
        <div style="font-size: 24px;color: #888888;text-align: center;margin-top: 40px;">使用云账户里的余额发红包</div>
    </div>
    
</div>