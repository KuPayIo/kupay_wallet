{{let content = it1.content}}
{{if it1.showtype==2}}
    {{: content=it1.content}}
{{end}}
<div class="ga-new-page" ev-back-click="backPrePage" style="background-color: #f9f9f9;">
    <app-components-topBar-topBar>{title:"常用地址"}</app-components-topBar-topBar>
    <div w-class="coinlist">
        {{for ind,val of it1.coins}}
            <span w-class="coinitem {{it1.selectnum==ind?'coinselect':''}}" on-tap="coinchange(e,{{ind}})">{{val.name}}</span>
        {{end}}
    </div>                          
    <div w-class="addressmanageContent" class="hide-scrollbar" style="overflow-y: auto;overflow-x: hidden;">
        {{for ind,val of content}}
            <addressitem$>{{val}}</addressitem$>
        {{end}}
    </div>
    <div w-class="blueBtn" on-tap="addNewaddr">
        添加常用地址
    </div>           
</div>