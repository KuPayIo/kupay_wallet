<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
	{{: topBarTitle = {"zh_Hans":"备份助记词","zh_Hant":"備份助記詞","en":""} }}
	<app-components-topBar-topBar>{title:{{topBarTitle}} }</app-components-topBar-topBar>
	<div w-class="body">
		<div w-class="bodyTitle">
			<pi-ui-lang>{"zh_Hans":"按序选择输入助记词","zh_Hant":"按序選擇輸入助記詞","en":""}</pi-ui-lang>
		</div>
		<div w-class="screen">
			 {{for index,item of it.nullMnemonic}}
			 <span w-class="screenItem" on-tap="confirmedMnemonicItemClick(e,{{index}})" 
			 style="{{index === 1 || index=== 4 || index === 7 || index === 10 ? 'margin:10px 10px 0;' : 'margin:10px 0 0;'}}{{it.confirmedMnemonic[index] ? 'opacity: 1;' :'opacity: 0;'}}">
			 {{ it.confirmedMnemonic[index] && it.confirmedMnemonic[index].word}}
			 </span>
			 {{end}}
		</div>
		
		<div w-class="bottom-box">
			<div w-class="itemsBox">
				{{for index,item of it.shuffledMnemonic}}
				<div w-class="item {{item.isActive ? 'checked' : ''}}" on-tap="shuffledMnemonicItemClick(e,{{index}})"  style="{{index === 1 || index=== 4 || index === 7 || index === 10 ? 'margin:10px 10px 0;' : 'margin:10px 0 0;'}}">
					{{item.word}}
				</div>
				{{end}}
			</div>
			

			<div w-class="btnBox">
				{{: sure = {"zh_Hans":"确定","zh_Hant":"確定","en":""} }}
				<div ev-btn-tap="nextStepClick" w-class="btn"><app-components1-btn-btn>{"name":{{sure}},"types":"big","color":"blue"}</app-components1-btn-btn></div>

			</div>
		</div>
	</div>
</div>