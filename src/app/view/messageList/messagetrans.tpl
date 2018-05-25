<div class="ga-new-page" ev-back-click="backPrePage" style="background-color: #f9f9f9;">
    <app-components-topBar-topBar>{title:"交易通知"}</app-components-topBar-topBar>
    {{for ind,val of it1.data}}
        <div w-class="transItem">   
            <span w-class="transRes">完成</span>    
            {{if val.type=="1"}}
                <div w-class="transType">转账</div> 
                <div w-class="transData">-{{val.content+" "+val.unit}}</div>
            {{else}}
                <div w-class="transType1">收款</div> 
                <div w-class="transData">+{{val.content+" "+val.unit}}</div>
            {{end}}
                       
        </div>
    {{end}}    
</div>