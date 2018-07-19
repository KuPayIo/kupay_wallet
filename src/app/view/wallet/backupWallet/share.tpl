<div id="share" class="ga-new-page">
	<div w-class="head">
		<div w-class="headMain">
			<span w-class="headTitle">
				<img on-tap="back" src="../../../res/image/btn_back.png" style="vertical-align: middle;margin-right: 20px;" />
				通过分享片段备份
			</span>
		</div>
	</div>
	<div w-class="stepBarBox">
		{{let totalSteps=it.totalSteps}}
		{{let i=1}}
		{{while i <= totalSteps}}
		<span w-class="step {{it1.step==i? 'stepchoosed' : ''}}"></span>
		{{:i=i+1}}
		{{end}}
	</div>
	<div w-class="body">
		<div w-class="note">
			<p>什么是分享备份</p>
			<p>
				将助记词加密并切片发给好友保存，只获得片段毫无作用，还需要您的长密码才能将其解密，所以请牢记长密码。
			</p>
		</div>
		
		<div w-class="part">
			{{it1.part}}
		</div>
		
		<div w-class="shareTitle">
			保存第
			{{if it1.step==1}}
			一
			{{elseif it1.step==2}}
			二
			{{elseif it1.step==3}}
			三
			{{elseif it1.step==4}}
			四
			{{else}}
			{{it1.step}}{{%当分享人数超过5则以数字形式显示}}
			{{end}}
			份
		</div>
		<div w-class="btnBox">
			<button w-class="shareBtn" on-tap="shareBtnClick">
				分享给第 {{it1.step}} 个人
			</button>
		</div>
	</div>
</div>