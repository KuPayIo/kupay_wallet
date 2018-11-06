{{let opca = it.scrollHeight/200 || 0}}
<div>
    <div style="{{opca>0?'background:rgba(255, 255, 255, '+ opca +');border-bottom: 2px solid #cccccc;':''}}" w-class="topBar">
        <img src="{{it.avatar ? it.avatar : '../../res/image1/default_avatar.png'}}" w-class="userHead" on-tap="showMine"/>
        {{if it.text}}
        <div w-class="total-asset">{{it.text}}</div>
        {{end}}
        {{if it1}}
        <widget w-tag="pi-ui-lang" w-class="offline">{zh_Hans:"离线",zh_Hant:"離線",en:"Offline"}</widget>
        {{end}}
    </div>
    <img src="../../res/image1/{{opca>0?'refresh_blue.png':'refresh_white.png'}}" w-class="refreshBtn" on-tap="refreshPage" class="{{it.refresh ?'refreshing':''}}"/>
</div>
