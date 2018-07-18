<div id="backupMnemonicWord" class="ga-new-page">
	<div w-class="head">
		<div w-class="headMain">
			<span w-class="headTitle">
				<img on-tap="back" src="../../../res/image/btn_back.png" style="vertical-align: middle;margin-right: 20px;" />
				备份助记词
			</span>
			<span w-class="jumpOver" on-tap="jumpOver">
				跳过
			</span>
		</div>
	</div>
	<div w-class="body">
		<div w-class="bodyTitle">
			您的钱包已生成
		</div>
		<div w-class="tips">
			请将下面的助记词抄写在一张纸上，保存在安全的地方，如果丢失，将无法恢复您的钱包。助记词非常重要，如果丢失或泄露，您的资产将受到损失。
		</div>
		<div w-class="mnemonic">
			{{it1.mnemonicStr}}
		</div>
		<div w-class="btns">
			<button w-class="btn1" on-tap="next">
				已妥善保管
			</button>
			<button w-class="btn2" on-tap="shareClick">
				使用更安全的保管方案
			</button>
		</div>
	</div>
</div>