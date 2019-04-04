<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"红包详情","zh_Hant":"紅包詳情","en":""} }}
    {{if !it.scroll}}
    <app-components-topBar-topBar>{"title":{{topBarTitle}},background:"#DF5E5E" }</app-components-topBar-topBar>
    {{else}}
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    {{end}}
    <div w-class="content" on-scroll="pageScroll" id="exchangeDetail">
        <img src="../../../res/image/redEnvDetail.png" w-class="topBackimg"/>
        <div w-class="topBack">
            <img src="{{it.userHead?it.userHead:'../../../res/image/default_avater_big.png'}}" w-class="userHead"/>
            <div w-class="userName">{{it.userName}}
                {{if it.showPin}}
                <span w-class="other">
                    <pi-ui-lang>{"zh_Hans":"拼","zh_Hant":"拼","en":""}</pi-ui-lang>
                </span>
                {{end}}
            </div>
            <div>{{it.message}}</div>
            <div w-class="describe">{{it.amount > 0 ? (it.amount+" "+it.ctypeShow):"已抢光"}}</div>
        </div>
        <div w-class="bottom">
            {{if it.rtype==99}}
                <div w-class="tips">
                    <pi-ui-lang>{"zh_Hans":"已存入云账户","zh_Hant":"已存入雲賬戶","en":""}</pi-ui-lang>
                </div>
            {{else}}
                <div w-class="tips">
                    <pi-ui-lang>{"zh_Hans":"已领取","zh_Hant":"已領取","en":""}</pi-ui-lang>
                    {{it.curNum+"/"+it.totalNum}}，
                    <pi-ui-lang>{"zh_Hans":"共","zh_Hant":"共","en":""}</pi-ui-lang>
                    {{it.totalAmount+it.ctypeShow}}
                </div>

                {{% ====================领取记录===================}}
                {{for ind,val of it.redBagList}}
                {{: userName = {"zh_Hans":val.userName,"zh_Hant":val.userName,"en":""} }}
                {{: greatUser = {"zh_Hans":"手气最佳","zh_Hant":"手氣最佳","en":""} }}

                <app-components-fourParaImgItem-fourParaImgItem>{name:{{userName}},data:{{val.amount+" "+it.ctypeShow}},time:{{val.timeShow}},img:{{val.avatar}},describe:{{it.greatUser==ind?greatUser:""}} }</app-components-fourParaImgItem-fourParaImgItem>
                {{end}}
            {{end}}
        </div>

    </div>
</div>