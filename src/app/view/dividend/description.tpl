<div w-class="newPage" class="new-page" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{title:{{it.tabBar[it.state]}} }</app-components-topBar-topBar>
    <div w-class="body">
        {{if it.state==0}}
            {{if it.showDataList.length}}
                {{for i,v of it.showDataList}}
                <div w-class="item">
                    <div w-class="num">{{v.num}}</div>
                    <div w-class="myIncomeInfo">
                        <div w-class="title">{{v.name}}</div>
                        <div w-class="time">{{v.time}}</div>
                    </div>
                </div>
                {{end}}
            {{end}}
        {{elseif it.state==1}}
            {{for i,v of it.dividendDescription}}
                <div w-class="legend">
                    <div w-class="legendTitle">{{v.name}}</div>
                    {{for j,t of v.answer}}
                        <div w-class="answer">{{t}}</div>
                    {{end}}
                </div>
            {{end}}
        {{else}}
            {{for i,v of it.legend}}
            <div w-class="legend">
                <div w-class="legendTitle">{{v.name}}</div>
                {{for j,t of v.answer}}
                    <div w-class="answer">{{t}}</div>
                {{end}}
            </div>
            {{end}}
        {{end}}
    </div>
</div>