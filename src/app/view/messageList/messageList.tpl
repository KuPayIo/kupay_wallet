<div class="ga-new-page" style="background-color: #f9f9f9;">
    <div w-class="ga-top-banner">
        <img src="../../res/image/btn_back.png" w-class="ga-back" on-tap="backPrePage"/>
        <span w-class="ga-banner-title">消息</span>
        <span w-class="ga-banner-btn">全部已读</span>
    </div>
    <div w-plugin='{"mod":"pi/widget/scroller/scroller", "options":{} }' style="position: relative;top:0px;bottom:0px;width:100%;">
        {{for ind,val of it.data}}
            
            <div w-class="messItem " on-tap="messDetail(e,{{ind}})" >
                {{if val.noread}}
                    <div w-class="is-noread"></div>
                {{end}}
                <span w-class="messType">{{val.typename}}</span>
                {{if val.type == "1"}}
                    <span>：{{val.name}}</span>
                {{end}}
                <span w-class="messTime">{{val.time}}</span>       
                <div w-class="messTitle">{{val.title}}                   
                    {{if val.type == "2"}}
                        <span>：{{val.content}}</span>
                    {{end}}
                </div>                    
            </div>
        {{end}}
    </div>
</div>
