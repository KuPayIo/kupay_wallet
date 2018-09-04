<div class="ga-new-page" style="background-image: linear-gradient(-180deg, #FFB800 0%, #FFE400 100%);overflow-y: auto;height: 100%;overflow-x: hidden; ">
    <app-components1-topBar-topBar>{"title":"做任务"}</app-components1-topBar-topBar>

    <div>
        {{for ind,val of it1.data}}
        <div w-class="miningItem"  on-tap="goDetail( {{ind}} )">
            <div>
                <img src="{{val.itemImg}}" w-class="itemImg"/>
                <span w-class="itemName">{{val.itemName}}</span>
                <img src="{{val.isComplete?'../../../res/image/icon_right2.png':'../../../res/image/icon_right.png'}}" w-class="itemNum"/>
            </div>
            <div w-class="itemDetail">
                <widget w-tag="pi-ui-html">{{val.itemDetail}}</widget>
            </div>
        </div>
        {{end}}
    </div>
</div>