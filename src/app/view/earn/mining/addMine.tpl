<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"做任务","zh_Hant":"做任務","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>

    <div style="overflow-y: auto;overflow-x: hidden;flex: 1 0 0;-webkit-overflow-scrolling: touch;scroll-behavior: smooth;">
        <div w-class="content">
            {{for ind,val of it.data}}
                {{if val.modulIsShow}}
                <div ev-imgAndBtn-tap="goDetail({{ind}})">
                    <app-components-imgAndBtnItem-imgAndBtnItem>{
                            "name":{{val.itemName}},
                            "describe":{{val.itemShort}},
                            "img":{{val.itemImg}},
                            "btnName":{{val.btnName}},
                            isComplete:{{val.isComplete}}
                        }
                    </app-components-imgAndBtnItem-imgAndBtnItem>
                </div>
                {{end}}
            {{end}}
        </div>

    </div>

</div>