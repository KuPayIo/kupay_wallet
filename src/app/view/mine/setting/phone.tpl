<div class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}} }</app-components1-topBar-topBar>
    <div style="margin: 30px 20px;" ev-getCode="phoneChange">
        <app-components-bindPhone-bindPhone></app-components-bindPhone-bindPhone>
    </div>
    <div w-class="content">
        {{if !it1.isSuccess}}
        <div w-class="verify">{{it1.cfgData.warn}}</div>
        {{end}}
        
        <div style="text-align: center;margin-top: 60px;">
            {{for ind,val of [1,2,3,4]}}
            <div w-class="codeBottom">
                <input type="number" w-class="codeInput" id="codeInput{{ind}}" on-keyup="codeChange" on-focus="codeFocus"/>
            </div>
            {{end}}
            
        </div>
    </div>
</div>