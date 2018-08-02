<div class="ga-new-page" ev-back-click="backPrePage" style="background-color: #fff;">
    <app-components-topBar-topBar>{title:"分红记录"}</app-components-topBar-topBar>
    <div w-class="history">

        {{for ind,val of it1.data}}
        <div w-class="historyitem">
            <div>
                <span w-class="itemName">{{val.name}}</span>
                <span w-class="itemNum">{{val.num}} ETH</span>
            </div>
            <div>
                <span w-class="itemTime">{{val.time}}</span>
                <span w-class="itemTotal">{{val.total}} ETH</span>
            </div>
        </div>
        {{end}}
        
    </div>
</div>