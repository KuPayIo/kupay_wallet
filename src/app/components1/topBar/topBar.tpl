{{let flag=it.background && it.background!='' && it.background!='#fff'}}
{{let flag1=it.background && it.background!=''}}
<div w-class="outer {{flag1?'':'outer-bottom'}}" style="background: {{it.background}}">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="ga-top-banner" >
        <div w-class="left-container" on-down="onShow">
            <img on-tap="backPrePage" src="../../res/image/{{flag ? 'left_arrow_white.png' : 'left_arrow_blue.png'}}" w-class="ga-back" />
            <span on-tap="backPrePage"  style="color: {{flag?'#fff':''}}">
                <pi-ui-lang>{{it.title}}</pi-ui-lang>
            </span>
            {{if it1}}
            <widget w-tag="pi-ui-lang" w-class="offline">{zh_Hans:"离线",zh_Hant:"離線",en:"Offline"}</widget>
            {{end}}
        </div>
        <div style="flex:1">{{% 空占位}}</div>

        <div style="display: flex;align-items: center;" on-down="onShow">
            {{if it.text}}
            <span w-class="text" on-tap="goNext">{{it.text}}</span>
            {{end}}
            {{if it.nextImg}}
            <img on-tap="goNext" src="{{it.nextImg}}" w-class="ga-next" />
            {{end}}
        </div>
        {{if it.nextImg1}}
        <div style="display:inline-block" on-down="onShow">
            <img on-tap="goNext1" src="{{it.nextImg1}}" w-class="refreshBtn"/>
        </div>
        {{end}}
        {{if it.refreshImg}}
        <div style="display:inline-block" on-down="onShow">
            <img on-tap="refreshPage" src="{{it.refreshImg}}" w-class="refreshBtn" class="{{it.refresh?'refreshing':''}}"/>
        </div>
        {{end}}
    </div>
</div>