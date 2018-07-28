<div class="ga-new-page" id="createByImg" ev-back-click="backPrePage">
	<app-components-topBar-topBar>{title:"生成钱包"}</app-components-topBar-topBar>
	<div w-class="topBar">
		同一张照片和同样的字符会生成同一个的钱包。所以可以记住您的照片和输入字符，这也是一种备份手段。
	</div>
	<div w-class="imgBox" on-tap="chooseImg">
		{{if !it1.choosedImg}}
		<div w-class="boxAlt">
			<p w-class="altTitle">选择一张照片</p>
			<p w-class="altMain">请使用颜色丰富的照片</p>
		</div>
		{{else}}
		<widget w-tag="pi-ui-html" >{{it1.imgStr}}</widget>
		<div w-class="closeicon" on-tap="removeImg"></div>
		{{end}}
	</div>
	<div w-class="inputTitle">
		<input type="text" class="input" on-input="inputIng" w-class="input" placeholder="输入一串用于生成助记词的字符" />
	</div>
	<div w-class="tips">
		记住您的照片和输入字符，这也是一种备份手段
	</div>
	<div w-class="btnWhite" on-tap="nextStep">
		生成钱包
	</div>
</div>