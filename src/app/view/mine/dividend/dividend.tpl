{{: it=it.totalHold||0}}
<div class="ga-new-page" style="background-image: linear-gradient(-180deg, #F94E4E 0%, #F6A151 100%);">
    <div w-class="">
        <div w-class="ga-top-banner">
            <img src="../../../res/image/btn_back_white.png" w-class="ga-back" on-tap="backPrePage"/>
            <span w-class="ga-banner-title" on-tap="backPrePage">累计分红</span>    
            <span w-class="ga-next" on-tap="goHistory">分红历史</span>
        </div>
        <div w-class="groupcard">
            <div w-class="dividend-title">累计分红(ETH)</div>
            <div w-class="dividend-money">{{it1.totalDivid}}</div>
            <div w-class="dividLine"></div>
            <div w-class="dividend-sum">持有 {{it}} KT</div>
            
        </div>  
        
        <div w-class="groupcard">
            <div w-class="twodata">
                <div w-class="data">
                    <div w-class="data-title" style="border-right: 3px solid rgb(227,230,245); ">本次分红(ETH)</div>
                    <div w-class="data-num" style="border-right: 3px solid rgb(227,230,245); ">{{it1.thisDivid}}</div>
                </div>
                <div w-class="data">
                    <div w-class="data-title" style="border-right: 3px solid rgb(227,230,245); ">年化收益(ETH/份)</div>
                    <div w-class="data-num" style="border-right: 3px solid rgb(227,230,245); ">{{it1.yearIncome}}</div>
                </div>
                <div w-class="data">
                    <div w-class="data-title">已分红天数</div>
                    <div w-class="data-num">{{it1.totalDays}}</div>
                </div>
            </div>   
        </div>
    </div>
    <div w-class="groupcard">
        <span w-class="rule-title">分红规则</span>
        <div w-class="dividend-rule">
            <div w-class="rulemess">1、KT最小分红单位为份，1份KT=3000KT。</div>
            <div w-class="rulemess">2、分红开始之前可增加持有KT获取更多分红。</div>
            <div w-class="rulemess">3、分红时间是北京时间(同台北时间)每周五下午2点。</div>
            <div w-class="rulemess">4、拥有1000KT才具有提现权限。</div>
            <div w-class="rulemess">5、KuPay拥有最终解释权。</div>   
        </div>
    </div>
</div>
