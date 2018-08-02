{{: it=it||1}}
{{% 默认显示矿山排名，传入数据为1 则是矿山排名，2 则是挖矿排名}}
<div class="ga-new-page" ev-back-click="backPrePage" style="background-color: #fff;">
    <app-components-topBar-topBar>{title:{{it==1?"矿山排名":"挖矿排名"}} }</app-components-topBar-topBar>
    <div style="height: 10px;background: #F8F8F8"></div>

    <div style="height: 100%;overflow-x: hidden;overflow-y: auto;">
        <div w-class="rankItem" style="color: #A0ACC0;">
            <span style="margin-left: 50px;">排名</span>
            <span style="margin-left: 67px;">昵称</span>
            <span style="float: right;margin-right: 30px;">{{it==1?"矿山":"挖矿"}}总量(KT)</span>        
        </div>
    
        {{for ind,val of it1.gainRank}}
        <div w-class="rankItem" style="color: #666666;">
            <span style="margin-left: 50px;color: #111111">{{val.index}}</span>
            <span style="margin-left: 67px;">{{val.name}}</span>
            <span style="float: right;margin-right: 30px;">{{val.num}}</span>        
        </div>
        {{end}}
    
        <div style="height: 128px;"></div>
    </div>
</div>