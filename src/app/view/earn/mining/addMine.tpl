<div class="new-page" style="background: #F2F2F2;" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":"做任务"}</app-components1-topBar-topBar>

    <div style="overflow-y: auto;overflow-x: hidden;height: 100%;">
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
        
        <div style="height: 128px;"></div>
    </div>
    
</div>