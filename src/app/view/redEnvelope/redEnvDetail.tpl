<div class="new-page" ev-back-click="backPrePage" w-class="new-page">
    {{: topBarTitle = {"zh_Hans":"红包详情","zh_Hant":"紅包詳情","en":""} }}	
    {{if !it.scroll}}
    <app-components-topBar-topBar>{"title":{{topBarTitle}},background:"#DF5E5E" }</app-components-topBar-topBar>
    {{else}}
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    {{end}}
    <div w-class="content" on-scroll="pageScroll" id="redEnvDetail">
        <img src="../../../res/image/redEnvDetail.png" w-class="topBackimg"/>
        <div w-class="topBack">
            <img src="{{it.userHead}}" w-class="userHead"/>
            <div style="margin: 30px 0 10px;font-size: 30px;color: #222222;">
                {{it.userName}}
                {{if it.showPin}}
                <span w-class="other"><pi-ui-lang>{"zh_Hans":"拼","zh_Hant":"拼","en":""}</pi-ui-lang></span>
                {{end}}
            </div>
            <div>{{it.message}}</div>
        </div>
        <div w-class="bottom">
            <div w-class="tips">
                <pi-ui-lang>{"zh_Hans":"已领取","zh_Hant":"已領取","en":""}</pi-ui-lang>{{it.curNum + "/" + it.totalNum +"，"}}
                <pi-ui-lang>{"zh_Hans":"共","zh_Hant":"共","en":""}</pi-ui-lang>
                {{it.amount + it.ctypeShow}}
            </div>
            {{for ind,val of it.redBagList}}
                {{: userName = {"zh_Hans":val.userName,"zh_Hant":val.userName,"en":""} }}
                {{: greatUser = {"zh_Hans":"手气最佳","zh_Hant":"手氣最佳","en":""} }}	
                <app-components-fourParaImgItem-fourParaImgItem>{name:{{userName}},data:{{val.amount+" "+it.ctypeShow}},time:{{val.timeShow}},img:{{val.avatar}},describe:{{it.greatUser==ind?greatUser:""}} }</app-components-fourParaImgItem-fourParaImgItem>
            {{end}}

            {{if it.curNum < it.totalNum && !it.outDate}}
            <div w-class="endMess">
                <div w-class="againSend" on-tap="againSend">
                    <pi-ui-lang>{"zh_Hans":"继续发送","zh_Hant":"繼續發送","en":""}</pi-ui-lang>
                </div>
                <div><pi-ui-lang>{"zh_Hans":"24小时未领取的红包将退回云账户","zh_Hant":"24小時未領取的紅包將退回雲賬戶","en":""}</pi-ui-lang></div>
            </div>
            {{end}}
        </div>

    </div>
</div>