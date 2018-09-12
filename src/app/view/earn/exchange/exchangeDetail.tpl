<div class="new-page">
    {{if !it1.scroll}}
    <app-components1-topBar-topBar>{"title":"红包详情",background:"#DF5E5E" }</app-components1-topBar-topBar>
    {{else}}
    <app-components1-topBar-topBar>{"title":"红包详情"}</app-components1-topBar-topBar>
    {{end}}
    <div w-class="content" on-scroll="pageScroll" id="content">
        <img src="../../../res/image/redEnvDetail.png" w-class="topBackimg"/>
        <div w-class="topBack">
            <img src="../../../res/image/default_avater_big.png" w-class="userHead"/>
            <div style="margin: 30px 0 10px;font-size: 30px;color: #222222;">用户名<span w-class="other">拼</span></div>
            <div>{{it1.message}}</div>
            <div style="font-size: 72px;color: #222222;font-weight: 600;margin: 50px 0 90px;">{{it1.amount+" "+it.ctypeShow}}</div>
        </div>
        <div w-class="bottom">
            <div w-class="tips">已领取{{it.curNum+"/"+it.totalNum}}，共{{it.amount+it.ctypeShow}}</div>
            {{for ind,val of it1.redBagList}}
                <app-components-fourParaImgItem-fourParaImgItem>{name:"昵称未设置",data:{{val.amount+" "+it.ctypeShow}},time:{{val.timeShow}},img:"../../res/image/default_avater_big.png"}</app-components-fourParaImgItem-fourParaImgItem>
            {{end}}
        </div>

        <div style="height: 128px;"></div>
    </div>
</div>