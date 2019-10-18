{{let opca = it.scrollHeight/200 || 0}}
<div style="{{opca>0?'background:rgba(255, 255, 255, '+ opca +');border-bottom: 1px solid #cccccc;':''}}" w-class="topBar">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="topBar-content">
        <div style=" display: flex;align-items: center;">
            <div on-tap="showMine" on-down="onShow" >
                <widget w-tag="app-components1-img-img" w-class="userHead" >{imgURL:{{it.avatar}},width:"48px;"}</widget>
            </div>
            {{if it.text}}
            <div w-class="total-asset">{{it.text}}</div>
            {{end}}
            {{if it1}}
            <widget w-tag="pi-ui-lang" w-class="offline">{zh_Hans:"离线",zh_Hant:"離線",en:"Offline"}</widget>
            {{end}}
        </div>
        {{if it.title}}
        <div w-class="title">{{it.title}}</div>
        {{end}}
        <div style="display:inline-block;width: 100px;" on-down="onShow">
            {{if it.nextImg}}
            <img src="{{it.nextImg}}" w-class="refreshBtn" on-tap="goNext"/>
            {{end}}
        </div>
    </div>
</div>
    
