<div id="backupMnemonicWordConfirm" class="ga-new-page" ev-back-click="backPrePage">
		<app-components-topBar-topBar>{title:"备份助记词"}</app-components-topBar-topBar>
		<span w-class="jumpOver" on-tap="jumpOver">
				跳过
		</span>
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
			<div w-class="btn" on-tap="nextStepClick">
				完成
			</div>
		</div>
	</div>
</div>