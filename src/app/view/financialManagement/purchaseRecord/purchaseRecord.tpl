<div class="ga-new-page" w-class="ga-new-page" ev-back-click="goBackPage">
    <app-components-topBar-topBar>{title:"我的理财"}</app-components-topBar-topBar>
    {{if !(it1.recordList&&it1.recordList.length>0)}}
    <div w-class="hideOrShow">
        <img src="../../../res/image/img_none_record.png" w-class="imgtip" />
        <div w-class="textTip">
            还没有购买理财哦
        </div>
    </div>
    {{end}}
    
    {{for i,v of it1.recordList}}
    <div w-class="mineItem" on-tap="toDetail({{i}})">
        <div w-class="mineTitle">
            {{v.productName}}
            {{if v.state=='2'}}
            <span w-class="stateSpan stateEnd">
                已赎回
            </span>
            {{end}}
            {{if v.state=='1'}}
            <span w-class="stateSpan">
                收益中
            </span>
            {{end}}
           
        </div>
        <div w-class="mineMain">
            <div w-class="mainLeft">
                <div w-class="normalTitle">
                    持有(0.01/份)
                </div>
                <div w-class="normalMain">
                    {{v.amount}}份
                </div>
            </div>
            <div w-class="mainMid">
                <div w-class="normalTitle">
                    昨日收益(ETH)
                </div>
                <div w-class="incomMain">
                    {{v.profit}}
                </div>
            </div>
            <div w-class="mainRight">
                <div w-class="normalTitle">
                    累计
                </div>
                <div w-class="normalMain">
                    {{v.days}}天
                </div>
            </div>
        </div>
    </div>
    {{end}}

</div>