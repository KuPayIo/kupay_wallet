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
            <div>红包留言最长的字有二十个字足足二十个字哦</div>
            <div style="font-size: 72px;color: #222222;font-weight: 600;margin: 50px 0 90px;">15 KT</div>
        </div>
        <div w-class="bottom">
            <div w-class="tips">已领取2/4，共40KT</div>
            {{for ind,val of it1.list}}
                <app-components-fourParaImgItem-fourParaImgItem>{{val}}</app-components-fourParaImgItem-fourParaImgItem>
            {{end}}
        </div>

        <div style="height: 128px;"></div>
    </div>
</div>