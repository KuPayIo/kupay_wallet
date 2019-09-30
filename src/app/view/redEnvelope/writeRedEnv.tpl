{{let item = it.list[it.selected]}}
{{let itemName = item.name === 'KT' ? it.ktShow : item.name}}
<div class="new-page" style="background: #f9f9f9;" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"发红包","zh_Hant":"發紅包","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}},nextImg:"../../res/image/26_white.png",background:"#F46262;"}</app-components-topBar-topBar>

    <form w-class="content" ev-selectBox-change="changeCoin" id="content">
    
        <app-components-selectBox-selectBox>{list:{{it.list}},selected:{{it.selected}},forceHide:{{it.forceHide}} }</app-components-selectBox-selectBox>
        <div style="font-size: 28px;color: #888888;margin: 0 30px;">
            {{: changePin = [
            {"zh_Hans":"当前为","zh_Hant":"當前為","en":""},
            {"zh_Hans":"改为","zh_Hant":"改為","en":""}] }}
            
            {{: redEnvType = [
            {"zh_Hans":"普通红包","zh_Hant":"普通紅包","en":""},
            {"zh_Hans":"拼手气红包","zh_Hant":"拼手氣紅包","en":""}] }}

            {{if it.inFlag !== "chat_user"}}
            <pi-ui-lang>{{changePin[0]}} </pi-ui-lang>
            <pi-ui-lang>{{it.showPin ? redEnvType[1] : redEnvType[0]}}</pi-ui-lang>，
            <span w-class="changeType" on-tap="changePin">
                <pi-ui-lang>{{changePin[1]}}</pi-ui-lang>
                <pi-ui-lang>{{it.showPin? redEnvType[0] : redEnvType[1]}}</pi-ui-lang>
            </span>
            {{end}}
        </div>
        <div ev-input-change="changeAmount">

            {{: amountTitle = [{"zh_Hans":"总金额","zh_Hant":"總金額","en":""},
            {"zh_Hans":"单个金额","zh_Hant":"單個金額","en":""},
            {"zh_Hans":"0","zh_Hant":"0","en":""},
            {"zh_Hans":itemName,"zh_Hant":itemName,"en":""}] }}

            <app-components-basicInput-basicInput>{
                prepend:{{it.showPin? amountTitle[0] : amountTitle[1]}},
                placeholder:{{amountTitle[2]}},
                itype:{{it.selected===0? "integer" : "number"}},
                maxLength:8,
                append:{{amountTitle[3]}},
                isShowPin:{{it.showPin}},
                input:{{it.oneAmount}},
                notUnderLine:true
                }</app-components-basicInput-basicInput>
        </div>
        <div style="margin: 10px 0;" ev-input-change="changeNumber">

            {{: countTitle = [{"zh_Hans":"红包个数","zh_Hant":"紅包個數","en":""},
            {"zh_Hans":"0","zh_Hant":"0","en":""},
            {"zh_Hans":"个","zh_Hant":"個","en":""}] }}

            {{if it.inFlag !== "chat_user"}}
            <app-components-basicInput-basicInput>{
                prepend:{{countTitle[0]}},
                placeholder:{{countTitle[1]}},
                itype:"integer",
                maxLength:3,
                append:{{countTitle[2]}},
                input:{{it.totalNum}},
                notUnderLine:true
                }</app-components-basicInput-basicInput>
            {{end}}
        </div>
        <div style="margin: 10px 0;" ev-input-change="changeMessage">
            {{: messTitle = [{"zh_Hans":"留言","zh_Hant":"留言","en":""},{"zh_Hans":"恭喜发财，万事如意","zh_Hant":"恭喜發財 萬事如意","en":""}] }}
            <app-components-basicInput-basicInput>{
                prepend:{{messTitle[0]}},
                placeholder:{{messTitle[1]}},
                input:{{it.message}},
                maxLength:20,
                notUnderLine:true
                }</app-components-basicInput-basicInput>
        </div>
        <div w-class="totalNum">{{it.totalAmount+" "+itemName}}</div>
        <div style="margin: 0 40px;" ev-btn-tap="send">
            {{: btnName = {"zh_Hans":"塞钱进红包","zh_Hant":"塞錢進紅包","en":""} }}
            <app-components1-btn-btn>{"name":{{btnName}},"types":"big","style":"background:#F46262;"}</app-components1-btn-btn>
        </div>
        <div style="font-size: 24px;color: #888888;text-align: center;margin-top: 40px;">
            <pi-ui-lang>{"zh_Hans":"使用云账户里的余额发红包","zh_Hant":"使用雲賬戶裡的餘額發紅包","en":""}</pi-ui-lang>
        </div>
    </form>

</div>