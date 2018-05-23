<div class="ga-new-page" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{title:"消息"}</app-components-topBar-topBar>
    {{for ind,val of it.data}}
        <div w-class="messItem" on-tap="messDetail(e,{{ind}})">
            <span w-class="messType">{{val.type}}：</span>
            <span w-class="messTitle">{{val.title}}</span>        
            <span w-class="messTime">{{val.time}}</span>                    
        </div>
    {{end}}
</div>