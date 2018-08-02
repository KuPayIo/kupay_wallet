<div class="ga-new-page" ev-back-click="backPrePage" style="background-color: #fff;">
    <app-components-topBar-topBar>{title:"排名"}</app-components-topBar-topBar>
    <div style="height: 10px;background: #F8F8F8"></div>

    <div style="height: 100%;margin-bottom: 128px;overflow-x: hidden;overflow-y: auto;">
        <div style="line-height: 100px;border-bottom: 1px solid #e5e5ee;">
            <span w-class="title">矿山排名</span>
            <span w-class="more" on-tap="gotoMore(1)">更多<img src="../../../res/image/btn_right_arrow.png" w-class="moreImg"/></span>
        </div>
    
        <div w-class="rank">
            <div w-class="rankSecond">
                <img src="../../../res/image/btn_exc_add.png" style="width: 100px;height: 100px;border-radius: 50%;background: #E1E1E1"/>
                <div w-class="rankName">我的名字有十个字</div>
                <div w-class="rankNum">98,605,000.090</div>
                <div style="width: 190px;height: 160px;background: #E1E1E1"></div>
            </div>
    
            <div w-class="rankFirst">
                <img src="../../../res/image/btn_exc_add.png" style="width: 100px;height: 100px;border-radius: 50%;background: #FFCE49"/>
                <div w-class="rankName" style="width: auto">我的名字有十个字</div>
                <div w-class="rankNum">98,605,000.090</div>
                <div style="width: 190px;height: 280px;background: #FFCE49"></div>
            </div>
    
            <div w-class="rankThree">
                <img src="../../../res/image/btn_exc_add.png" style="width: 100px;height: 100px;border-radius: 50%;background: #CDA257"/>
                <div w-class="rankName">我的名字有十个字</div>
                <div w-class="rankNum">98,605,000.090</div>
                <div style="width: 190px;height: 110px;background: #CDA257"></div>
            </div>
        </div>
    
        <div w-class="rankItem" style="color: #A0ACC0;">
            <span style="margin-left: 50px;">排名</span>
            <span style="margin-left: 67px;">昵称</span>
            <span style="float: right;margin-right: 30px;">矿山总量(KT)</span>        
        </div>
    
        {{for ind,val of it1.gainRank}}
        <div w-class="rankItem" style="color: #666666;">
            <span style="margin-left: 50px;color: #111111">{{val.index}}</span>
            <span style="margin-left: 67px;">{{val.name}}</span>
            <span style="float: right;margin-right: 30px;">{{val.num}}</span>        
        </div>
        {{end}}
        <div w-class="moreRank" on-tap="getMore(1)">更多</div>
        <div style="height: 20px;background: #f8f8f8;"></div>


        {{% 挖矿排名}}
        <div style="line-height: 100px;border-bottom: 1px solid #e5e5ee;">
            <span w-class="title">挖矿排名</span>
            <span w-class="more" on-tap="gotoMore(2)">更多<img src="../../../res/image/btn_right_arrow.png" w-class="moreImg"/></span>
        </div>
        <div w-class="rank">
            <div w-class="rankSecond">
                <img src="../../../res/image/btn_exc_add.png" style="width: 100px;height: 100px;border-radius: 50%;background: #E1E1E1"/>
                <div w-class="rankName">我的名字有十个字</div>
                <div w-class="rankNum">98,605,000.090</div>
                <div style="width: 190px;height: 160px;background: #E1E1E1"></div>
            </div>
    
            <div w-class="rankFirst">
                <img src="../../../res/image/btn_exc_add.png" style="width: 100px;height: 100px;border-radius: 50%;background: #FFCE49"/>
                <div w-class="rankName" style="width: auto">我的名字有十个字</div>
                <div w-class="rankNum">98,605,000.090</div>
                <div style="width: 190px;height: 280px;background: #FFCE49"></div>
            </div>
    
            <div w-class="rankThree">
                <img src="../../../res/image/btn_exc_add.png" style="width: 100px;height: 100px;border-radius: 50%;background: #CDA257"/>
                <div w-class="rankName">我的名字有十个字</div>
                <div w-class="rankNum">98,605,000.090</div>
                <div style="width: 190px;height: 110px;background: #CDA257"></div>
            </div>
        </div>

        <div w-class="rankItem" style="color: #A0ACC0;">
            <span style="margin-left: 50px;">排名</span>
            <span style="margin-left: 67px;">昵称</span>
            <span style="float: right;margin-right: 30px;">挖矿总量(KT)</span>        
        </div>
    
        {{for ind,val of it1.gainRank}}
        <div w-class="rankItem" style="color: #666666;">
            <span style="margin-left: 50px;color: #111111">{{val.index}}</span>
            <span style="margin-left: 67px;">{{val.name}}</span>
            <span style="float: right;margin-right: 30px;">{{val.num}}</span>        
        </div>
        {{end}}
        <div w-class="moreRank" on-tap="getMore(2)">更多</div>
        <div style="height: 20px;background: #f8f8f8;"></div>

        <div style="height: 128px;"></div>
    </div>
</div>