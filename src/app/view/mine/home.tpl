<div class="ga-new-page" style="background-color: #f9f9f9;">
    <div w-class="ga-top-banner" on-tap="walletManagementClick">
        <img src="../../res/image/{{it1.avatar}}" w-class="avatar"/>
        <span w-class="ga-banner-title">{{it1.walletName}}</span>
        <span w-class="ga-banner-btn" on-tap="backupClick">
            请备份
        </span>
      
    </div>
    <div style="background-color: #fff;">
        {{for index,item of it1.mineList}}
            {{if index<3}}
            <div w-class="ga-item" on-tap="itemClick(e,{{index}})" style="{{index==2?'border-bottom:none':''}}">
                <img src="../../res/image/{{item.icon}}" w-class="ga-item-icon"/>
                <span w-class="ga-item-text">{{item.text}}</span>
                <img src="../../res/image/btn_right_arrow.png" w-class="ga-item-arrow"/>
            </div>
            {{end}}
        {{end}}
    </div>
    <div style="background-color: #fff;">
        {{for index,item of it1.mineList}}
            {{if index>2 && index<5}}
            <div w-class="ga-item" on-tap="itemClick(e,{{index}})" style="{{index==4?'border-bottom:none':''}}">
                <img src="../../res/image/{{item.icon}}" w-class="ga-item-icon"/>
                <span w-class="ga-item-text">{{item.text}}</span>
                <img src="../../res/image/btn_right_arrow.png" w-class="ga-item-arrow"/>
            </div>
            {{end}}
        {{end}}
    </div>
    <div style="background-color: #fff;">
        {{for index,item of it1.mineList}}
            {{if index>4}}
            <div w-class="ga-item" on-tap="itemClick(e,{{index}})" style="{{index==7?'border-bottom:none':''}}">
                <img src="../../res/image/{{item.icon}}" w-class="ga-item-icon"/>
                <span w-class="ga-item-text">{{item.text}}</span>
                <img src="../../res/image/btn_right_arrow.png" w-class="ga-item-arrow"/>
            </div>
            {{end}}
        {{end}}
    </div>
    
</div>