<div class="ga-new-page" style="background-color: #f9f9f9;">
    <div w-class="ga-top-banner" on-tap="walletManagementClick">

        <span w-class="ga-banner-title">{{it1.walletName ? it1.walletName : "我的钱包"}}</span>
        <span w-class="ga-banner-btn-Box">

        
        {{if !it1.mnemonicBackup && (it1.wallet || it1.walletList.length > 0)}}
        <span w-class="ga-banner-btn" on-tap="backupClick">
                请备份
        </span>
        {{end}}
        <img src="../../res/image/cloud_arow_right.png" w-class="arowIcon"/>
        </span>
      
    </div>

    <div>
        {{for index,item of it1.mineList}}
            <div w-class="ga-item" on-tap="itemClick(e,{{index}})" style="{{index==2?'border-bottom:none':''}}">
                <img src="../../../res/image/{{item.icon}}" w-class="ga-item-icon"/>
                <span w-class="ga-item-text">{{item.text}}</span>
                <img src="../../../res/image/btn_right_arrow.png" w-class="ga-item-arrow"/>
            </div>
        {{end}}
    </div>
    
</div>