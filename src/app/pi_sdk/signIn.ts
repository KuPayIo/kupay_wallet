import { closePopBox, popNewLoading, popNewMessage } from './sdkTools';

/**
 * 登录
 */
// tslint:disable-next-line:max-func-body-length
export const createSignInStyle = () => {
    const cssText = `
    .signIn_page{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.5);
    }
    .title{
        display: flex;
        align-items: center;
        font-size: 48px;
        color: #fff;
        margin: 100px 70px 0;
    }
    .phoneInput{
        width:500px;
        height:80px;
        position: relative;
    }
    .pi_input_inner{
        appearance:none;
        -moz-appearance:none; /* Firefox */
        -webkit-appearance:none; /* Safari 和 Chrome */
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        display: inline-block;
        font-size: inherit;
        height: 100%;
        line-height: 40px;
        outline: 0;
        -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
        padding: 10px;
        padding-left: 70px;
        color: #222;
        font-size: 32px;
    }
    .codeBox{
        display: flex;
        margin-top: 20px;
    }
    .codeInput{
        width:300px;
        height:80px;
        border:3px solid rgba(66,133,244,1);
        position: relative;
    }
    .codeBtn{
        width:190px;
        height:80px;
        background:rgba(48,129,237,1);
        border-radius:4px;
        margin-left: 10px;
        font-size:28px;
        color:rgba(255,255,255,1);
        line-height:80px;
        text-align: center;
    }
    .loginBtn{
        width:500px;
        height:80px;
        margin-top: 20px;
        background:linear-gradient(90deg,rgba(86,204,242,1) 0%,rgba(47,128,237,1) 100%);
        font-size: 32px;
        text-align: center;
        line-height: 80px;
        color: #fff;
    }
    .noticeLog{
        text-align: center;
        height:33px;
        font-size:24px;
        color:rgba(136,136,136,1);
        line-height:33px;
        margin-top: 20px;
        margin-bottom: 80px;
    }
    .row{
        display: flex;
        align-items:center;
        color: #CCCCCC;
        font-size: 24px;
    }
    .divideLine{
        width:200px;
        height:1px;
        background:rgba(136,136,136,1);
        margin: 30px;
    }
    .column{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .signInImg{
        width: 100px;
        height: 100px;
        margin-bottom: 5px;
    }
    .inputIcon{
        position: absolute;
        top: 25px;
        left: 20px;
        width: 30px;
        height: 30px;
    }
    `;
    const style = document.createElement('style');
    style.type = 'text/css';
    // tslint:disable-next-line:no-inner-html
    style.innerHTML = cssText;
    document.getElementsByTagName('head')[0].appendChild(style);
};

// 创建注册界面
export const createSignInPage = () => {
    const elem = document.createElement('div');
    elem.classList.add('signIn_page');
    const title = `
    <div class="title">
        <img src="${(<any>window).pi_sdk.config.imgUrlPre}/signIn_user.png" style="width: 50px;height:50px;margin-right:5px;"/>
        <span>登录好嗨</span>
    </div>`;
    const content = `
    <div style="display:flex;align-items:center;flex-direction: column;margin-top:80px;">
        <div class="phoneInput">
            <img src="${(<any>window).pi_sdk.config.imgUrlPre}/signIn_tel.png" class="inputIcon"/>
            <input type="number" class="pi_input_inner" id="phoneInput"/>
        </div>
        <div class="codeBox">
            <div class="codeInput">
                <img src="${(<any>window).pi_sdk.config.imgUrlPre}/signIn_pwd.png" class="inputIcon"/>
                <input type="number" class="pi_input_inner" id="codeInput"/>
            </div>
            <div class="codeBtn" id="countdown">获取验证码</div>
        </div>
        <div class="loginBtn" id="phoneLogin">登录</div>
        <div class="noticeLog">
            <span>登录即代表您同意</span>
            <span style="margin-left: 10px;color:#4C90F5;">《用户协议及隐私服务》</span>
        </div>

        <div class="row">
            <span class="divideLine"></span>
            <span>其它登录</span>
            <span class="divideLine"></span>
        </div>

        <div class="row" style="justify-content: space-around;width: 610px;">
            <div class="column" id="qqLogin">
                <img src="${(<any>window).pi_sdk.config.imgUrlPre}/signIn_qq.png" class="signInImg"/>
                <span>QQ登录</span>
            </div>
            <div class="column" id="wxLogin">
                <img src="${(<any>window).pi_sdk.config.imgUrlPre}/signIn_wx.png" class="signInImg"/>
                <span>微信登录</span>
            </div>
            <div class="column" id="wbLogin">
                <img src="${(<any>window).pi_sdk.config.imgUrlPre}/signIn_wb.png" class="signInImg"/>
                <span>微博登录</span>
            </div>
            <div class="column" id="touristLogin">
                <img src="${(<any>window).pi_sdk.config.imgUrlPre}/signIn_tourist.png" class="signInImg"/>
                <span>游客登录</span>
            </div>
        </div>
    </div>
    `;
    
    // tslint:disable-next-line:no-inner-html
    elem.innerHTML = (<any>window).pi_sdk.config.isHorizontal ? content :(title + content);
    const piRoot = document.createElement('div');
    piRoot.classList.add('pi-root');
    piRoot.appendChild(elem);
    document.querySelector('body').appendChild(piRoot);

    document.querySelector('#countdown').addEventListener('click',getCode);
    document.querySelector('#phoneLogin').addEventListener('click',phoneLogin);
    document.querySelector('#wxLogin').addEventListener('click',wxLogin);
    document.querySelector('#qqLogin').addEventListener('click',qqLogin);
    document.querySelector('#wbLogin').addEventListener('click',wbLogin);
    document.querySelector('#touristLogin').addEventListener('click',touristLogin);
};

// 获取验证码
const getCode = () => {
    const phone = document.querySelector('#phoneInput').value;
    const reg = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;
    if (!phone || !reg.test(phone)) {
        popNewMessage('无效的手机号');
        
        return; 
    }
    (<any>window).pi_sdk.pi_RPC_Method((<any>window).pi_sdk.config.jsApi, 'sendCode', phone, (error, res) => {
        let countdown = 60;
        const timer = setInterval(() => {
            countdown--;
            document.querySelector('#countdown').innerHTML = `${countdown}s 重新获取`;
            if (countdown === 0) {
                document.querySelector('#countdown').innerHTML = `获取验证码`;
                clearInterval(timer);
            }
        },1000);
    });
    
};

export enum UserType {
    wallet= 1,  
    tel= 2,   // 手机号
    wx= 3,   // 微信
    tourist= 4  // 游客
}

// 手机号登录
const phoneLogin = () => {
    const phone = document.querySelector('#phoneInput').value;
    const code = document.querySelector('#codeInput').value;
    if (!phone) {
        popNewMessage('请输入手机号');

        return;
    }
    if (!code) {
        popNewMessage('请输入验证码');

        return;
    }
    popNewLoading('登录中');
    (<any>window).pi_sdk.pi_RPC_Method((<any>window).pi_sdk.config.jsApi, 'thirdManualLogin', {
        userType:UserType.tel,
        user:phone,
        pwd:code
    }, (error, res) => {
        closePopBox();
        if (error) {
            popNewMessage('登录失败');
        } else {
            popNewMessage('登录成功');
        }
    });
};

// 微信登录
const wxLogin = () => {
    popNewLoading('登录中');
    (<any>window).pi_sdk.pi_RPC_Method((<any>window).pi_sdk.config.jsApi, 'wechatLogin', null, (error, res) => {
        closePopBox();
        
        if (error) {
            popNewMessage('登录失败');
        } else {
            popNewMessage('登录成功');
        }
    });
    setTimeout(() => {
        closePopBox();
        console.log('3秒自动停止转圈');
    }, 3000);
};

// 游客登录
const touristLogin = () => {
    popNewLoading('登录中');
    (<any>window).pi_sdk.pi_RPC_Method((<any>window).pi_sdk.config.jsApi, 'thirdManualLogin', {
        userType:UserType.tourist,
        user:'',
        pwd:''
    }, (error, res) => {
        closePopBox();
        
        if (error) {
            popNewMessage('登录失败');
        } else {
            popNewMessage('登录成功');
        }
    });
};

// qq登录
const qqLogin = () => {
    // 敬请期待
};

// 微博登录
const wbLogin = () => {
    // 敬请期待
};