<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{if !it1.scroll}}
    <app-components1-topBar-topBar>{"title":{{_cfg.topBarTitle}},background:"#DF5E5E" }</app-components1-topBar-topBar>
    {{else}}
    <app-components1-topBar-topBar>{"title":{{_cfg.topBarTitle}} }</app-components1-topBar-topBar>
    {{end}}
    <div w-class="content" on-scroll="pageScroll" id="exchangeDetail">
        <img src="../../../res/image/redEnvDetail.png" w-class="topBackimg"/>
        <div w-class="topBack">
            <img src="../../../res/image/default_avater_big.png" w-class="userHead"/>
            <div style="margin: 30px 0 10px;font-size: 30px;color: #222222;">{{_cfg.defaultUserName}}
                {{if it1.showPin}}<span w-class="other">{{_cfg.pin}}</span>{{end}}
            </div>
            <div>{{it1.message}}</div>
            <div style="font-size: 72px;color: #222222;font-weight: 600;margin: 50px 0 90px;">{{it.amount+" "+it.ctypeShow}}</div>
        </div>
        <div w-class="bottom">
            {{if it.rtype==99}}
                <div w-class="tips">{{_cfg.tips[0]}}</div>
            {{else}}
                <div w-class="tips">{{_cfg.tips[1]}}{{it.curNum+"/"+it.totalNum}}，{{_cfg.tips[2]}}{{it.amount+it.ctypeShow}}</div>
                {{for ind,val of it1.redBagList}}
                    <app-components-fourParaImgItem-fourParaImgItem>{name:{{_cfg.defaultUserName}},data:{{val.amount+" "+it.ctypeShow}},time:{{val.timeShow}},img:"../../res/image/default_avater_big.png"}</app-components-fourParaImgItem-fourParaImgItem>
                {{end}}
            {{end}}
        </div>

    </div>
</div>