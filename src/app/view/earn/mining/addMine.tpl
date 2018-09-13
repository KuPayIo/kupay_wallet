<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":"做任务"}</app-components1-topBar-topBar>

    <div style="overflow-y: auto;overflow-x: hidden;flex: 1 0 0;">
        <div w-class="content">
            {{for ind,val of it1.data}}
            <div on-tap="show({{ind}})" ev-imgAndBtn-tap="goDetail({{ind}})">
                <app-components-imgAndBtnItem-imgAndBtnItem>{"name":{{val.itemName}},"describe":{{val.itemShort}},"img":{{val.itemImg}},"btnName":"做任务",isComplete:{{val.isComplete}} }</app-components-imgAndBtnItem-imgAndBtnItem>
                {{if val.show}}
                <div w-class="itemDetail">
                    {{val.itemDetail}}
                </div>
                {{end}}
            </div>
            {{end}}
        </div>
        
    </div>
    
</div>