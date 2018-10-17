<div class="new-page" ev-back-click="backPrePage" w-class="new-page">
    {{if !it1.scroll}}
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}},background:"#DF5E5E" }</app-components1-topBar-topBar>
    {{else}}
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}} }</app-components1-topBar-topBar>
    {{end}}
    <div w-class="content" on-scroll="pageScroll" id="redEnvDetail">
        <img src="../../../res/image/redEnvDetail.png" w-class="topBackimg"/>
        <div w-class="topBack">
            <img src="{{it1.userHead}}" w-class="userHead"/>
            <div style="margin: 30px 0 10px;font-size: 30px;color: #222222;">
                {{it1.userName}}
                {{if it1.showPin}}<span w-class="other">{{it1.cfgData.pin}}</span>{{end}}
            </div>
            <div>{{it1.message}}</div>
        </div>
        <div w-class="bottom">
            <div w-class="tips">{{it1.cfgData.tips[0] + it.curNum + "/" + it.totalNum}}，{{it1.cfgData.tips[1] + it.amount + it.ctypeShow}}</div>
            {{for ind,val of it1.redBagList}}
                <app-components-fourParaImgItem-fourParaImgItem>{name:{{val.userName}},data:{{val.amount+" "+it.ctypeShow}},time:{{val.timeShow}},img:{{val.avatar}},describe:{{it1.greatUser==ind?it1.cfgData.greatUser:""}} }</app-components-fourParaImgItem-fourParaImgItem>
            {{end}}

            {{if it.curNum < it.totalNum && !it.outDate}}
            <div w-class="endMess">
                <div w-class="againSend" on-tap="againSend">{{it1.cfgData.tips[2]}}</div>
                <div>{{it1.cfgData.tips[3]}}</div>
            </div>
            {{end}}
        </div>

    </div>
</div>