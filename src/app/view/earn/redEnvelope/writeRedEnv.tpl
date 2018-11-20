{{let item = it1.list[it1.selected]}}
<div class="new-page" style="background: #f9f9f9;" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"发红包","zh_Hant":"發紅包","en":""} }}
    <app-components1-topBar-topBar>{"title":{{topBarTitle}},nextImg:"../../res/image/26_white.png",background:"#F46262;"}</app-components1-topBar-topBar>

    <form w-class="content" ev-selectBox-change="changeCoin" id="content">
    
        <app-components-selectBox-selectBox>{list:{{it1.list}},selected:{{it1.selected}},forceHide:{{it1.forceHide}} }</app-components-selectBox-selectBox>
        <div style="font-size: 28px;color: #888888;margin: 0 30px;">
            {{: changePin = [
            {"zh_Hans":"每个红包金额","zh_Hant":"每個紅包金額","en":""},
            {"zh_Hans":"随机","zh_Hant":"隨機","en":""},
            {"zh_Hans":"固定","zh_Hant":"固定","en":""},
            {"zh_Hans":"，改为","zh_Hant":"，改為","en":""}] }}

            <pi-ui-lang>{{changePin[0]}} </pi-ui-lang>
            <pi-ui-lang>{{it1.showPin ? changePin[1] : changePin[2]}}</pi-ui-lang>
            <pi-ui-lang>{{changePin[3]}}</pi-ui-lang>
            <span w-class="changeType" on-tap="changePin">
                {{: redEnvType = [
                {"zh_Hans":"普通红包","zh_Hant":"普通紅包","en":""},
                {"zh_Hans":"拼手气红包","zh_Hant":"拼手氣紅包","en":""}] }}

                <pi-ui-lang>{{it1.showPin? redEnvType[0] : redEnvType[1]}}</pi-ui-lang></span>
        </div>
        <div ev-input-change="changeAmount">

            {{: amountTitle = [{"zh_Hans":"总金额","zh_Hant":"總金額","en":""},
            {"zh_Hans":"单个金额","zh_Hant":"單個金額","en":""},
            {"zh_Hans":"0","zh_Hant":"0","en":""},
            {"zh_Hans":item.name,"zh_Hant":item.name,"en":""}] }}

            <app-components-basicInput-basicInput>{
                prepend:{{it1.showPin? amountTitle[0] : amountTitle[1]}},
                placeholder:{{amountTitle[2]}},
                itype:"number",
                append:{{amountTitle[3]}},
                isShowPin:{{it1.showPin}},
                input:{{it1.oneAmount}},
                notUnderLine:true
                }</app-components-basicInput-basicInput>
        </div>
        <div style="margin: 10px 0;" ev-input-change="changeNumber">

            {{: countTitle = [{"zh_Hans":"红包个数","zh_Hant":"紅包個數","en":""},
            {"zh_Hans":"0","zh_Hant":"0","en":""},
            {"zh_Hans":"个","zh_Hant":"個","en":""}] }}

            <app-components-basicInput-basicInput>{
                prepend:{{countTitle[0]}},
                placeholder:{{countTitle[1]}},
                itype:"integer",
                append:{{countTitle[2]}},
                input:{{it1.totalNum}},
                notUnderLine:true
                }</app-components-basicInput-basicInput>
        </div>
        <div style="margin: 10px 0;" ev-input-change="changeMessage">
            {{: messTitle = [{"zh_Hans":"留言","zh_Hant":"留言","en":""},{"zh_Hans":"恭喜发财，万事如意","zh_Hant":"恭喜發財 萬事如意","en":""}] }}
            <app-components-basicInput-basicInput>{
                prepend:{{messTitle[0]}},
                placeholder:{{messTitle[1]}},
                input:{{it1.message}},
                notUnderLine:true
                }</app-components-basicInput-basicInput>
        </div>
        <div w-class="totalNum">{{it1.totalAmount+" "+item.name}}</div>
        <div style="margin: 0 40px;" ev-btn-tap="send">
            {{: btnName = {"zh_Hans":"塞钱进红包","zh_Hant":"塞錢進紅包","en":""} }}
            <app-components1-btn-btn>{"name":{{btnName}},"types":"big","style":"background:#F46262;"}</app-components1-btn-btn>
        </div>
        <div style="font-size: 24px;color: #888888;text-align: center;margin-top: 40px;">
            <pi-ui-lang>{"zh_Hans":"使用云账户里的余额发红包","zh_Hant":"使用雲賬戶裡的餘額發紅包","en":""}</pi-ui-lang>
        </div>
    </form>

</div>