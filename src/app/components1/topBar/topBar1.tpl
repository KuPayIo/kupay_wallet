{{let opca = it.scrollHeight/200 || 0}}
<div>
    <div style="{{opca>0?'background:rgba(255, 255, 255, '+ opca +');border-bottom: 1px solid #cccccc;':''}}" w-class="topBar">
        <div on-tap="showMine">
            <widget w-tag="app-components1-img-img" w-class="userHead" >{imgURL:{{it.avatar ? it.avatar : 'app/res/image1/default_avatar.png'}},width:"48px;"}</widget>
        </div>
        {{if it.text}}
        <div w-class="total-asset">{{it.text}}</div>
        {{end}}
        {{if it}}
        <widget w-tag="pi-ui-lang" w-class="offline">{zh_Hans:"离线",zh_Hant:"離線",en:"Offline"}</widget>
        {{end}}
    </div>
    <img src="../../res/image1/{{opca>0?'refresh_blue.png':'refresh_white.png'}}" w-class="refreshBtn" on-tap="refreshPage" class="{{it.refresh ?'refreshing':''}}"/>
</div>
