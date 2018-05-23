<div class="ga-new-page" ev-back-click="backPrePage" w-class="messlist">
    <div w-class="ga-top-banner">
        <img src="../../res/image/u12.png" w-class="ga-back" on-tap="backPrePage"/>
        <span w-class="ga-banner-title">消息</span>
        <span w-class="ga-banner-btn">全部已读</span>
    </div>
    <div w-plugin='{"mod":"pi/widget/scroller/scroller", "options":{} }' style="position: relative;top:0px;bottom:0px;width:100%;">
        {{for ind,val of it.data}}
            
            <div w-class="messItem " on-tap="messDetail(e,{{ind}})" >
                {{if val.noread}}
                    <div w-class="is-noread"></div>
                {{end}}
                <span w-class="messType">{{val.type}}</span>
                <span w-class="messTime">{{val.time}}</span>       
                <div w-class="messTitle">{{val.title}}</div>           
            </div>
        {{end}}
    </div>
</div>
