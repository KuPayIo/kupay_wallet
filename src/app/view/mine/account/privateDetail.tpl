<div class="new-page" ev-back-click="backPrePage" w-class="new-page">
    {{: topBarTitle = {"zh_Hans":"私钥","zh_Hant":"私鑰","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    <div style="overflow-x: hidden;overflow-y: auto;flex: 1 0 0;-webkit-overflow-scrolling: touch;scroll-behavior: smooth;">
        <div w-class="content">
            {{: title = [{"zh_Hans":"什么是私钥？","zh_Hant":"什麼是私鑰？","en":""},
            {"zh_Hans":"如何使用私钥？","zh_Hant":"如何使用私鑰？","en":""}] }}

            {{: content = [
            {"zh_Hans":"私钥是钱包地址所对应的“密码”，一个私钥对应一个地址，先有私钥后有地址。私钥是由十二个随机的英文单词通过哈希计算后得到，是一串64个十六进制的字符。私钥又通过计算生成地址，且通过地址是无法反向计算出私钥的。","zh_Hant":"私鑰是錢包地址所對應的“密碼”，一個私鑰對應一個地址，先有私鑰後有地址。私鑰是由十二個隨機的英文單詞通過哈希計算後得到，是一串64個十六進制的字符。私鑰又通過計算生成地址，且通過地址是無法反向計算出私鑰的。","en":""},
            {"zh_Hans":"私钥既是数字资金所有权的凭证，也是数字资金控制权的唯一凭证，泄露私钥相当于将银行卡号和密码同时告诉他人。","zh_Hant":"私鑰既是數字資金所有權的憑證，也是數字資金控制權的唯一憑證，泄露私鑰相當於將銀行卡號和密碼同時告訴他人。","en":""},
            {"zh_Hans":"1、私钥生成后一定妥善保管，切记做好备份;","zh_Hant":"1、私鑰生成後一定妥善保管，切記做好備份;","en":""},
            {"zh_Hans":"2、私钥不要保存至邮箱、网盘、聊天工具等触网的地方;","zh_Hant":"2、私鑰不要保存至郵箱、網盤、聊天工具等觸網的地方;","en":""},
            {"zh_Hans":"3、私钥不要截图、拍照保存至手机或电脑上;","zh_Hant":"3、私鑰不要截圖、拍照保存至手機或電腦上;","en":""},
            {"zh_Hans":"4、私钥不可随意告诉任何人;","zh_Hant":"4、私鑰不可隨意告訴任何人;","en":""},
            {"zh_Hans":"5、不要轻易将私钥导入不信任的网站及钱包应用;","zh_Hant":"5，不要輕易將私鑰導入不信任的網站及錢包應用;","en":""}] }}
            <div w-class="title"><pi-ui-lang>{{title[0]}}</pi-ui-lang></div>
            <div style="padding: 0 30px;line-height: 50px;">
                <p style="margin-bottom: 50px;"><pi-ui-lang>{{content[0]}}</pi-ui-lang></p>
                <p><pi-ui-lang>{{content[1]}}</pi-ui-lang></p>
            </div>
            <div w-class="title"><pi-ui-lang>{{title[1]}}</pi-ui-lang></div>
            <div style="padding: 0 30px 50px;line-height: 50px;">
                <p><pi-ui-lang>{{content[2]}}</pi-ui-lang></p>
                <p><pi-ui-lang>{{content[3]}}</pi-ui-lang></p>
                <p><pi-ui-lang>{{content[4]}}</pi-ui-lang></p>
                <p><pi-ui-lang>{{content[5]}}</pi-ui-lang></p>
                <p><pi-ui-lang>{{content[6]}}</pi-ui-lang></p>
            </div>
        </div>
    </div>
</div>