<div id="backupMnemonicWordConfirm" class="ga-new-page">
	<div w-class="head">
		<div w-class="headMain">
			<span w-class="headTitle">
				<img on-tap="back" src="../../../res/image/btn_back.png" style="vertical-align: middle;margin-right: 20px;" />
				备份钱包
			</span>
			<span w-class="jumpOver" on-tap="jumpOver">
				跳过
			</span>
		</div>
	</div>
	<div w-class="body">
		<div w-class="bodyTitle">
			确认你的助记词
		</div>
		<div w-class="tips">
			请按顺序选择您刚才抄写的助记词
		</div>
		<div w-class="screen">
			 {{for index,item of it1.confirmedMnemonic}}
			 <span w-class="screenItem" on-tap="confirmedMnemonicItemClick(e,{{index}})">{{item.word}}</span>
			 {{end}}
		</div>
		
		<div w-class="itemsBox">
			{{for index,item of it1.shuffledMnemonic}}
			<div w-class="item {{item.isActive ? 'checked' : ''}}" on-tap="shuffledMnemonicItemClick(e,{{index}})">
				{{item.word}}
			</div>
			{{end}}
		</div>
		
		<div w-class="btnBox">
			<button w-class="btn" on-tap="nextStepClick">
				完成
			</button>
		</div>
	</div>
</div>