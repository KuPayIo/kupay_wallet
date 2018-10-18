<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{if !it1.scroll}}
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}},background:"#DF5E5E" }</app-components1-topBar-topBar>
    {{else}}
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}} }</app-components1-topBar-topBar>
    {{end}}
    <div w-class="content" on-scroll="pageScroll" id="exchangeDetail">
        <img src="../../../res/image/redEnvDetail.png" w-class="topBackimg"/>
        <div w-class="topBack">
            <img src="{{it1.userHead}}" w-class="userHead"/>
            <div w-class="userName">{{it1.userName}}
                {{if it1.showPin}}<span w-class="other">{{it1.cfgData.pin}}</span>{{end}}
            </div>
            <div>{{it1.message}}</div>
            <div w-class="describe">{{it.amount+" "+it.ctypeShow}}</div>
        </div>
        <div w-class="bottom">
            {{if it.rtype==99}}
                <div w-class="tips">{{it1.cfgData.tips[0]}}</div>
            {{else}}
                <div w-class="tips">{{it1.cfgData.tips[1]}}{{it1.curNum+"/"+it1.totalNum}}，{{it1.cfgData.tips[2]}}{{it1.totalAmount+it.ctypeShow}}</div>
                {{for ind,val of it1.redBagList}}
                <app-components-fourParaImgItem-fourParaImgItem>{name:{{val.userName}},data:{{val.amount+" "+it.ctypeShow}},time:{{val.timeShow}},img:{{val.avatar}},describe:{{it1.greatUser==ind?it1.cfgData.greatUser:""}} }</app-components-fourParaImgItem-fourParaImgItem>
                {{end}}
            {{end}}
        </div>

    </div>
</div>