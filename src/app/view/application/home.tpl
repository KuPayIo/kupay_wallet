<div class="ga-new-page" ev-back-click="backPrePage" style="background-color: #f9f9f9;" >
    <div w-class="applicationTop">
        <span w-class="applTab {{it1.activeIndex==0?'isactive':''}}" on-tap="tabClick(0)">全部</span>    
        <span w-class="applTab {{it1.activeIndex==1?'isactive':''}}" on-tap="tabClick(1)">游戏</span>    
        <span w-class="applTab {{it1.activeIndex==2?'isactive':''}}" on-tap="tabClick(2)">工具</span>    
        <span w-class="applTab {{it1.activeIndex==3?'isactive':''}}" on-tap="tabClick(3)">我的</span>    
    </div>                               
    <div w-class="applicationContent" w-plugin='{"mod":"pi/widget/scroller/scroller", "options":{} }'>
        <div style="height: 1600px;">
            {{for ind,val of it1.data}}
                <applicationItem$>{{val}}</applicationItem$>
            {{end}}
        </div>       
    </div>         
    <div style="height: 100px;position: relative;width: 100%; "></div>  
</div>