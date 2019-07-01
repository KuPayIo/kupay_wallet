{{let opca = it.scrollHeight/200 || 0}}
<div style="{{opca>0?'background:rgba(255, 255, 255, '+ opca +');border-bottom: 1px solid #cccccc;':''}}">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="ga-top-banner">
        <div w-class="left-container" on-down="onShow">
            <img on-tap="backPrePage" src="../../res/image/{{opca>0 ? 'left_arrow_blue.png' : 'left_arrow_white.png'}}" w-class="ga-back" />
            <span on-tap="backPrePage"  style="color: {{opca>0 ? '#222':'#fff'}}">
                {{if typeof(it.text)=="string"}}
                    {{it.text}}
                {{else}}
                <pi-ui-lang>{{it.text}}</pi-ui-lang>
                {{end}}
            </span>
        </div>
        <div style="flex:1">{{% 空占位}}</div>

        {{if it.nextImg}}
        <div style="display:inline-block" on-down="onShow">
            <img on-tap="goNext" src={{it.nextImg}} w-class="ga-next" />
        </div>
        {{end}}
        {{if it.isOne!=1}}
            <div style="display:inline-block" on-down="onShow">
                <img on-tap="refreshPage" src="../../res/image1/{{opca>0?'refresh_blue.png':'refresh_white.png'}}" w-class="refreshBtn" class="{{it.refresh?'refreshing':''}}"/>
            </div>
        {{end}}
    </div>
</div>