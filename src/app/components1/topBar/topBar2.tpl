{{let opca = it.scrollHeight/200 || 0}}
<div w-class="ga-top-banner" style="{{opca>0?'background:rgba(255, 255, 255, '+ opca +');border-bottom: 2px solid #cccccc;':'background:transparent;'}}">
    <div w-class="left-container">
        <img on-tap="backPrePage" src="../../res/image/{{opca>0 ? 'left_arrow_blue.png' : 'left_arrow_white.png'}}" w-class="ga-back" />
        <span on-tap="backPrePage"  style="color: {{opca>0 ? '#222':'#fff'}}">{{it.text}}</span>
        {{if it1}}
        <widget w-tag="pi-ui-lang" w-class="offline">{zh_Hans:"离线",zh_Hant:"離線",en:"Offline"}</widget>
        {{end}}
    </div>
    {{if it.nextImg}}
    <img on-tap="goNext" src={{it.nextImg}} w-class="ga-next" />
    {{end}}
    <img on-tap="refreshPage" src="../../res/image1/{{opca>0?'refresh_blue.png':'refresh_white.png'}}" w-class="refreshBtn" class="{{it.refresh?'refreshing':''}}"/>
</div>