<div class="ga-new-page" style="background: #ffffff;overflow-y: auto;height: 100%;overflow-x: hidden; ">
    <div w-class="ga-header">
        <div w-class="ga-top-banner">
            <img src="../../../res/image/btn_back_white.png" w-class="ga-back" on-tap="backPrePage"/>
            <span w-class="ga-banner-title">挖矿</span>    
            <img src="../../../res/image/btn_back_white.png" w-class="ga-next" on-tap="goHistory"/>
        </div>
        <div w-class="groupcard">
            <div w-class="dividend-title">矿山总量(KT)</div>
            <div w-class="dividend-money">65,655,000.496</div>
            <div w-class="dividend-sum" on-tap="goRank">
                <img src="../../../res/image/btn_back.png" style="width: 48px;height: 48px;display: inline-block;vertical-align: middle;"/>
                <span style="display: inline-block;vertical-align: middle;">矿山排名150位之前</span>
            </div>
        
            <div w-class="twodata">
                <div w-class="dataleft">
                    <div w-class="dataleft-title">本次可挖(KT)</div>
                    <div w-class="dataleft-num">13,131,000.099</div>
                </div>
                <div w-class="dataright">
                    <div w-class="dataright-title">已挖(KT)</div>
                    <div w-class="dataright-num">870,800.00</div>
                </div>
            </div>      
        </div>       
    </div>
    <div>
        <div style="text-align: center;margin-top: 120px;">
            <span w-class="line"></span>
            <span w-class="rule-title">挖矿规则</span>
            <span w-class="line"></span>            
        </div>
        <div w-class="dividend-rule">
            <div w-class="rulemess">1、用户每日可挖取储矿的20%KT，最高10000KT。</div>
            <div w-class="rulemess">2、储矿量小于100KT，则把剩下的一次性挖完。</div>
            <div w-class="rulemess">3、每日只能挖一次，挖矿结算后，挖到的数量将从储矿量中减去。</div>
            <div w-class="rulemess">4、真实用户的标准是曾经达到1000KT。</div>
            <div w-class="rulemess">5、拥有1000KT才具有提现权限。</div>   
        </div>

        <div style="padding-left: 30px;font-size: 36px;">增加储备矿</div>
        <div style="background: #F8F8F8;">
           
            <div style="padding-top: 20px;margin-bottom: 20px;background: #ffffff;line-height: 74px;">
                <span w-class="title">类目</span>
                <span w-class="total">总累积(KT)</span>
            </div>
        
            {{for ind,val of it1.data}}
            <div w-class="miningItem" >
                <div on-tap="goToggle( {{ind}} )">
                    <img src="../../../res/image/btn_back.png" w-class="itemImg"/>
                    <span w-class="itemName">{{val.itemName}}</span>
                    <span w-class="itemNum">{{val.itemNum}}</span>
                </div>
                <div w-class="itemDetail" style="display: {{val.isOpen?'block':'none'}}">
                    <widget w-tag="pi-ui-html">{{val.itemDetail}}</widget>
                    <div w-class="{{val.isComplete?'itemBtnNo':'itemBtn'}}" on-tap="goDetail( {{ind}} )">{{val.itemBtn}}</div>
                </div>
            </div>
            {{end}}
        </div>

    </div>
</div>