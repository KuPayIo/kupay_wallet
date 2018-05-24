<div class="ga-new-page" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{title:"关于我们"}</app-components-topBar-topBar>
    <div w-class="aboutus-img">
        <img src="../../res/image/u2458.png" style="width: 100%;"/>
    </div>
    
    {{for ind,val of it1.data}}
        <div w-class="listItem_div" on-tap="itemClick(e,{{ind}})">
            <span>{{val.value}}</span>
            <span w-class="ga-item-arrow" style="float: right;"></span>
        </div>
    {{end}}
</div>