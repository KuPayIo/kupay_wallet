/**
 * sdk tools
 */

/**
 * 悬浮框按钮样式
 */
// tslint:disable-next-line:max-func-body-length
export const createThirdBaseStyle = () => {
    const cssText = `
    .pi-message{
      position: fixed;
      left: 50%;
      bottom: 150px;
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.9);
      line-height: 22.5px;
      color: rgba(255, 255, 255, 0.87);
      font-size: 16px;
      text-align: center;
      padding: 9px 12.5px;
      transform: translateX(-50%);
      transition: opacity .3s, transform .4s;
      opacity: 0;
      z-index:99999;
    }
    .message-fade-enter {
      opacity: 1;
      transform: translate(-50%,-100%);
    }
    .pi-float-button{
      display: flex;
      align-items: center;
      justify-content: center;
      width:40px;
      height:40px;
      background:rgba(0,0,0,0.2);
      border-radius:50%;
      border:1px solid rgba(255,255,255,0.2);
      position: fixed;
      top: 100px;
      right:10px;
      z-index:99999;
    }
    .pi-dot1{
    width: 3.5px;
    height: 3.5px;
    background-color: #fff;
    border-radius: 50%;
    }
    .pi-dot2{
    width: 7.5px;
    height: 7.5px;
    background-color: #fff;
    border-radius: 50%;
    margin: 0 5px;
    }
  
    .pi-wx-btns{
      position:absolute;
      top:20px;
      right:10px;
      background-color:rgba(0,0,0,0.2);
      border-radius:16px;
      border:1px solid rgba(255,255,255,0.2);
      padding: 3.5px 10px;
      display: inline-flex;
      align-items: center;
      z-index:99999;
    }
    .pi-wx-dots{
        display: flex;
        align-items: center;
        width: 25px;
        height: 25px;
        justify-content: center;
    }
    .pi-wx-dot1{
        width:3.5px;
        height:3.5px;
        background-color: #fff;
        border-radius: 50%;
    }
    .pi-wx-dot2{
        width:6.5px;
        height:6.5px;
        background-color: #fff;
        border-radius: 50%;
        margin: 0 2.5px;
    }
    .pi-wx-circle{
        width:25px;
        height:25px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 17px;
    }
    .pi-wx-circle1{
        background-color:rgba(0,0,0,0);
        width:17px;
        height:17px;
        border: 2px solid #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        box-sizing: border-box;
    }
    .pi-wx-circle2{
        width:5px;
        height:5px;
        background-color: #fff;
        border-radius: 50%;
    }
    .pi-bottom-box{
        background:#fff;
        border-radius:20px 20px 0px 0px;
        position: absolute;
        bottom: -400px;
        left: 20px;
        right: 20px;
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 30px;
        transition: all .3s ease-in-out;
    }
    .pi-bottom-item{
        display: flex;
        width:25%;
        flex-direction: column;
        align-items: center;
        margin-top: 10px;
    }
    .pi-img-box{
        width: 100px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .pi-text{
        font-size:24px;
        font-family:"PingFangSC-Regular";
        font-weight:400;
        color:rgba(136,136,136,1);
        line-height:33px;
        margin-top: 10px;
    }
    `;
    // tslint:disable-next-line:variable-name
    const pi_root_css = `#pi-root{${browserAdaptive()}}.pi-root{${browserAdaptive()}}`;
    const style = document.createElement('style');
    style.type = 'text/css';
    // tslint:disable-next-line:no-inner-html
    style.innerHTML = pi_root_css + cssText;
    document.getElementsByTagName('head')[0].appendChild(style);
};
  
/**
 * 选择按钮
 */
export const buttonModInit = () => {
    return () => {
        if (window["pi_sdk"].config.buttonMod === window["pi_sdk"].config.buttonMods.FLOATBUTTON) {  // 可拖动悬浮框 三个点
            floatButtonInit();
        } else if (window["pi_sdk"].config.buttonMod === window["pi_sdk"].config.buttonMods.WXBUTTON) {   // 微信小程序悬浮框
            WxButtionInit();
        } else if (window["pi_sdk"].config.buttonMod === window["pi_sdk"].config.buttonMods.FLOATBUTTON2) { // 可拖动悬浮框 图标
            floatButtonInit2();
        } else {                    // 默认
            floatButtonInit2();
        }
        
    };
};

/**
 * 关闭弹框
 */
export const closePopBox = () => {
    const $root = document.querySelector('#pi-root');
    if ($root) {
        document.querySelector('body').removeChild($root);
    }
};

/**
 * 提示框
 */
export const popNewMessage = (msg) => {
    const $message = document.createElement('div');
    $message.setAttribute('class','pi-message');
    $message.textContent = msg;

    const $body = document.querySelector('body');
    $body.appendChild($message);
    setTimeout(() => {
        $message.setAttribute('class','pi-message message-fade-enter');
    },17);
    setTimeout(() => {
        $message.setAttribute('class','pi-message');
        setTimeout(() => {
            $body.removeChild($message);
        },300);
    },2000);
};

/**
 * 第三方api样式
 */
// tslint:disable-next-line:max-func-body-length
export const createThirdApiStyleTag = () => {
    const cssText = `
    .pi-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: rgba(50, 50, 50, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    }
    .pi-btns {
    margin: 30px 40px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    }
    .pi-cancel-btn {
    width: 220px;
    height: 80px;
    border-radius: 50px;
    border: 1px dashed rgba(136, 136, 136, 1);
    font-size: 32px;
    color: #888;
    display: flex;
    justify-content: center;
    align-items: center;
    }
    .pi-ok-btn {
    width: 220px;
    height: 80px;
    background: linear-gradient(
        270deg,
        rgba(68, 206, 237, 1) 0%,
        rgba(62, 179, 241, 1) 100%
    );
    box-shadow: 0px 5px 10px 0px rgba(13, 131, 246, 0.1);
    border-radius: 50px;
    font-size: 32px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    }
    .pi-sure-btn{
        border-top: 1px solid #CCCCCC;
        padding: 30px;
        text-align: center;
        color: #3294E6;
        font-size: 28px;
        font-weight: 600;
    }


    /* 获取openid */

    .pi-update-box {
    background-color: #fff;
    background-image: url(${window["pi_sdk"].config.imgUrlPre}update_bg.png);
    background-repeat: no-repeat;
    background-size: 100% 235px;
    width: 630px;
    border-radius: 12px;
    padding-bottom: 30px;
    position: relative;
    }
    .pi-update-rocket {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate3d(-50%, -30%, 0);
    }
    .pi-update-content {
    padding: 20px 30px;
    }
    .pi-update-title {
    margin-top: 250px;
    font-size: 32px;
    color: #111;
    line-height: 45px;
    }
    .pi-update-items {
    margin-top: 20px;
    }
    .pi-update-item {
    font-size: 28px;
    line-height: 40px;
    color: #8e96ab;
    }

    /* 支付 */
    .pi-pay-title {
        font-size:38px;
        height: 90px;
        text-align: center;
        line-height: 90px;
        border-bottom: 1px solid #CCCCCC;
    }

    .pi-pay-content {
        padding-top: 20px;
        font-size: 28px;
    }

    .pi-pay-item {
        line-height: 40px;
        height: 40px;
        margin-bottom: 10px;
    }
    .pi-pay-text{
        font-weight:500;
    }
    .pi-pay-num{
        color: #318DE6;
    }
    .pi-pay-input{
        height: 80px;
        width: 100%;
        border: 1px solid #1E6DEF;
        background:rgba(249,249,249,1);
        border-radius: 6px;
        font-size: 32px;
        padding: 0px 15px;
        box-sizing: border-box;
        letter-spacing: 2px;
        margin-top: 15px;
        outline:none;
    }

    /* 加载 */
    .pi-loading-mask{
        position: absolute;
        margin: 0;
        top: 0;
        right: 0;   
        bottom: 0;
        left: 0;
        -webkit-transition: opacity .3s;
        transition: opacity .3s;
        color: #fff;
        font-size: 24px;
    }
    .pi-loading-spinner{
        width: 180px;
        height: 180px;
        background-color: rgba(0,0,0,.6);
        top: 50%;
        left: 50%;
        text-align: center;
        position: absolute;
        transform: translate(-50%,-50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 12px;
        padding-top: 10px;
    }
    .loading-img{
        width: 50px;
        height: 50px;
        border: 4px solid white;
        border-bottom-color:transparent;
        -webkit-animation: loading 1s 0s linear infinite;
        animation: loading 1s 0s linear infinite;
        opacity:1;
        border-radius:50%;
    }
    .pi-loading-text{
        color: #fff;
        margin: 10px 0 20px;
    }
    .modalBox-body{
        background-color: #fff;
        padding: 30px;
        padding-bottom: 0;
        width: 570px;
        border-radius: 12px;
        box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
    }

    /* 动画 */
    @-webkit-keyframes bounceInUp {
    from,
    60%,
    75%,
    90%,
    to {
        -webkit-animation-timing-function: cubic-bezier(
        0.215,
        0.61,
        0.355,
        1
        );
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    from {
        opacity: 0;
        -webkit-transform: translate3d(0, 3000px, 0);
        transform: translate3d(0, 3000px, 0);
    }

    60% {
        opacity: 1;
        -webkit-transform: translate3d(0, -20px, 0);
        transform: translate3d(0, -20px, 0);
    }

    75% {
        -webkit-transform: translate3d(0, 10px, 0);
        transform: translate3d(0, 10px, 0);
    }

    90% {
        -webkit-transform: translate3d(0, -5px, 0);
        transform: translate3d(0, -5px, 0);
    }

    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
    }

    @keyframes bounceInUp {
    from,
    60%,
    75%,
    90%,
    to {
        -webkit-animation-timing-function: cubic-bezier(
        0.215,
        0.61,
        0.355,
        1
        );
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    from {
        opacity: 0;
        -webkit-transform: translate3d(0, 3000px, 0);
        transform: translate3d(0, 3000px, 0);
    }

    60% {
        opacity: 1;
        -webkit-transform: translate3d(0, -20px, 0);
        transform: translate3d(0, -20px, 0);
    }

    75% {
        -webkit-transform: translate3d(0, 10px, 0);
        transform: translate3d(0, 10px, 0);
    }

    90% {
        -webkit-transform: translate3d(0, -5px, 0);
        transform: translate3d(0, -5px, 0);
    }

    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
    }

    @keyframes loading {
    0% {
        -webkit-transform: rotate(0deg);
            transform: rotate(0deg); 
    }
    100%{
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg); 
    } 
    }

    .bounceInUp {
    -webkit-animation-name: bounceInUp;
    animation-name: bounceInUp;
    }
    .animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    }`;

    const style = document.createElement('style');
    style.type = 'text/css';
    // tslint:disable-next-line:no-inner-html
    style.innerHTML = cssText;
    document.getElementsByTagName('head')[0].appendChild(style);
};

// --------创建标签----------------------------------------------------------------------------------------------------------------------------

// 创建授权弹窗标签
export const createAuthorizeElementTag = () => {
    const htmlText = `
        <div class="pi-update-box animated bounceInUp">
            <img src="${window["pi_sdk"].config.imgUrlPre}rocket.png" class="pi-update-rocket" />
            <div class="pi-update-content">
                <div class="pi-update-title">您将获取以下授权</span></div>
                <div class="pi-update-items">
                </div>
            </div>
            <div class="pi-btns">
                <div class="pi-cancel-btn">取消</div>
                <div class="pi-ok-btn">确定</div>
            </div>
        </div>`;
    const $mask = document.createElement('div');
    $mask.setAttribute('class', 'pi-mask');
    // tslint:disable-next-line:no-inner-html
    $mask.innerHTML = htmlText;

    const $root = document.createElement('div');
    $root.setAttribute('id', 'pi-root');
    $root.appendChild($mask);

    const $body = document.querySelector('body');
    $body.appendChild($root);
};

// 创建支付弹窗标签
export const createPayElementTag = () => {
    const htmlText = `
        <div class="pi-update-box animated bounceInUp">
            <div class="pi-update-content">
                <div class="pi-pay-title">确认支付</div>
                <div class="pi-pay-content">
                    <div class="pi-pay-item">
                        <span>金额：</span><span id="pi_payCount" class="pi-pay-num">0.02ST</span>
                    </div>
                    <div class="pi-pay-item">
                        <span>发给：</span><span id="pi_payObject" class="pi-pay-text">LOL赛事竞猜</span>
                    </div>
                    <div class="pi-pay-item">
                        <span>余额：</span><span id="pi_payBalance" class="pi-pay-text">12ST</span>
                    </div>
                    <div>
                        <input class="pi-pay-input" type="password" placeholder="输入密码" name="" id="pi_password">
                    </div>
                </div>
            </div>
            <div class="pi-btns">
                <div class="pi-cancel-btn">取消</div>
                <div class="pi-ok-btn">确定</div>
            </div>
        </div>`;
    const $root = document.createElement('div');
    $root.setAttribute('class', 'pi-mask');
    // tslint:disable-next-line:no-inner-html
    $root.innerHTML = htmlText;

    const $body:any = document.querySelector('.pi-root');
    $body.appendChild($root);
    $body.style.display = 'flex';
};

// 创建加载弹窗标签
export const popNewLoading = (loadingStr) => {
    const htmlText = `
        <div class="pi-loading-mask">
            <div class="pi-loading-spinner">
                <div class="loading-img"></div>
                <p class="pi-loading-text">
                    ${loadingStr}
                </p>
            </div>
        </div>`;
    const $mask = document.createElement('div');
    $mask.setAttribute('class', 'pi-loading-mask');
    // tslint:disable-next-line:no-inner-html
    $mask.innerHTML = htmlText;

    const $root = document.createElement('div');
    $root.setAttribute('id', 'pi-root');
    $root.appendChild($mask);

    document.querySelector('body').appendChild($root);
};

/**
 * 密码弹框
 */
export const popInputBox =  (title,okCB,cancelCB?) => {
    createInputBoxElementTag(title);
    const $ok = document.querySelector('.pi-ok-btn');
    const $cancel = document.querySelector('.pi-cancel-btn');
    const $input = document.getElementById('pi_password');

    $ok.addEventListener('click',  () => {
        closePopBox();
        okCB && okCB((<any>$input).value);
    });

    $cancel.addEventListener('click',  () => {
        cancelCB && cancelCB();
        closePopBox();
    });
};

/**
 * 根据id获取buttonItem
 */
const getButtonItemById = (id) => {
    const index = window["pi_sdk"].config.showButtons.findIndex((item) => {
        return item.id === id;
    });

    return window["pi_sdk"].config.showButtons[index];
};

// 创建设置免密弹窗标签
const createInputBoxElementTag =  (title) => {
    const htmlText = `
        <div class="pi-update-box animated bounceInUp">
            <div class="pi-update-content">
                <div class="pi-pay-title">${title}</div>
                <div class="pi-pay-content">
                    <div>
                        <input class="pi-pay-input" type="password" placeholder="输入密码" name="" id="pi_password">
                    </div>
                </div>
            </div>
            <div class="pi-btns">
                <div class="pi-cancel-btn">取消</div>
                <div class="pi-ok-btn">确定</div>
            </div>
        </div>`;
    const $mask = document.createElement('div');
    $mask.setAttribute('class', 'pi-mask');
    // tslint:disable-next-line:no-inner-html
    $mask.innerHTML = htmlText;

    const $root = document.createElement('div');
    $root.setAttribute('id', 'pi-root');
    $root.appendChild($mask);

    document.querySelector('body').appendChild($root);
};

/**
 * 设置悬浮框按钮模式
 */
const setButtonMod = (buttonMod) => {
    console.log('setButtonMod',buttonMod);
    window["pi_sdk"].config.buttonMod = buttonMod;
};

/**
 * 悬浮框按钮样式1初始化
 */
const floatButtonInit = () => {
    console.log('floatButtonInit ---------floatButtonInit');
    const $floatButton = document.createElement('div');
    $floatButton.setAttribute('class','pi-float-button button-mod');
    // tslint:disable-next-line:no-inner-html
    $floatButton.innerHTML = `
    <span class="pi-dot1"></span>
    <span class="pi-dot2"></span>
    <span class="pi-dot1"></span>
    `;
    $floatButton.addEventListener('click',popNewPanel());
    document.querySelector('body').appendChild($floatButton);
  
    dragDom($floatButton);
};
  
  /**
   * 微信小程序按钮样式初始化
   */
const WxButtionInit = () => {
    console.log('~!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!WxButtionInit');
    const $wxBtns = document.createElement('div');
    $wxBtns.setAttribute('class','pi-wx-btns button-mod');
      
    const $wxDots = document.createElement('div');
    $wxDots.setAttribute('class','pi-wx-dots');
    // tslint:disable-next-line:no-inner-html
    $wxDots.innerHTML = `<span class="pi-wx-dot1"></span>
      <span class="pi-wx-dot2"></span>
      <span class="pi-wx-dot1"></span>`;
  
    const $wxCircle = document.createElement('div');
    $wxCircle.setAttribute('class','pi-wx-circle');
    // tslint:disable-next-line:no-inner-html
    $wxCircle.innerHTML = `<div class="pi-wx-circle1">
          <div class="pi-wx-circle2">
          </div>
      </div>`;
  
      // 弹出底部框
    $wxDots.addEventListener('click',popNewPanel());
  
      // 关闭游戏
    const closeItem = getButtonItemById(window["pi_sdk"].config.ButtonId.EXITGAME);
    $wxCircle.addEventListener('click',closeItem.clickCb);
  
    $wxBtns.appendChild($wxDots);
    $wxBtns.appendChild($wxCircle);
    document.querySelector('body').appendChild($wxBtns);
  
};
  
  /**
   * 悬浮框按钮样式2初始化
   */
const floatButtonInit2 =  () => {
    console.log('floatButtonInit2 ---------floatButtonInit2');
    const $floatButton = document.createElement('div');
    $floatButton.setAttribute('class','pi-float-button2 button-mod');
    // tslint:disable-next-line:max-line-length
    $floatButton.setAttribute('style','position: absolute;top:133px;right: 0px; width:50px;height:50px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);z-index: 99999;');
    // tslint:disable-next-line:no-inner-html
    $floatButton.innerHTML = `
          <img src="${window["pi_sdk"].config.imgUrlPre}wallet_logo.png" style="width:100%;height:100%;border-radius:50%;"/>
          <img src="${window["pi_sdk"].config.imgUrlPre}bubble.png" style="border-radius:50%;position: absolute;width:100%;height:100%;top:0;left:0;"/>
      `;
    $floatButton.addEventListener('click',popNewPanel());
    document.querySelector('body').appendChild($floatButton);
    
    dragDom($floatButton);
};

/**
 * 弹出底部面板框
 */
const popNewPanel = () => {
    return throttle(() => {
        const $bottomBox = document.createElement('div');
        $bottomBox.setAttribute('class','pi-bottom-box');
        $bottomBox.addEventListener('click',(e) => {
            e.stopPropagation();
            e.preventDefault();
        });
        window["pi_sdk"].config.showButtons.forEach((item,index) => {
            if (!item.show) return;
            const $bottomItem = document.createElement('div');
            $bottomItem.setAttribute('class','pi-bottom-item');
            if (window["pi_sdk"].config.isHorizontal) {  // 横屏游戏
                $bottomItem.style.flex = '1 0 0';
                $bottomItem.style.width = '160px';
            }
            $bottomItem.setAttribute('id',item.id);
            let imgUrl = item.img;
            let text = item.text;
            if (item.id === window["pi_sdk"].config.ButtonId.FREESECRET) {
                imgUrl = window["pi_sdk"].store.freeSecret ? item.startImg : item.closeImg;
                text = window["pi_sdk"].store.freeSecret ? item.startText : item.closeText;
            }
          
            // tslint:disable-next-line:no-inner-html
            $bottomItem.innerHTML = `<div class="pi-img-box"><img src="${window["pi_sdk"].config.imgUrlPre}${imgUrl}" class="pi-item-img"/></div>
              <div class="pi-text">${text}</div>`;
            $bottomItem.addEventListener('click',() => {
                (throttle(item.clickCb))();
                if (item.clickedClose) {
                    closePopBox();
                }
            });
  
            $bottomBox.appendChild($bottomItem);
        });
  
        const $root = document.createElement('div');
        $root.setAttribute('id','pi-root');
        $root.addEventListener('click',() => {
            (<any>document.querySelector('.pi-bottom-box')).style.bottom = '-400px';
            setTimeout(() => {
                document.querySelector('body').removeChild(document.querySelector('#pi-root'));
            },300);
        });
        $root.appendChild($bottomBox);
        document.querySelector('body').appendChild($root);
        requestAnimationFrame(() => {
            $bottomBox.style.bottom = '0px';
        });
  
    });
};

/**
 * 自适应
 */
const browserAdaptive =  () => {
    let cfg = {
        width: 750, height: 1334, wscale: 0, hscale: 0.25, full: false
    };
    if (window["pi_sdk"].config.isHorizontal) {  // 横屏游戏
        cfg = {
            width: 1334, height: 750, wscale: 0.25, hscale: 0, full: false
        };
    }
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    let rootWidth = cfg.width;
    let rootHeight = cfg.height;
    let scaleW = clientWidth / rootWidth;
    let scaleH = clientHeight / rootHeight;
    if (cfg.wscale >= cfg.hscale) {
        // 宽度比例变动
        if (scaleW > scaleH * (cfg.wscale + 1)) {
            // 大于规定的比例
            rootWidth = rootWidth * (cfg.wscale + 1) | 0;
        } else {
            rootWidth = (clientWidth / scaleH) | 0;
        }
        scaleW = scaleH;
    } else {
        // 高度比例变动
        if (scaleH > scaleW * (cfg.hscale + 1)) {
            rootHeight = rootHeight * (cfg.hscale + 1) | 0;
        } else {
            rootHeight = (clientHeight / scaleW) | 0;
        }
        scaleH = scaleW;
    }
    const rootX = (clientWidth - rootWidth) / 2;
    const rootY = (clientHeight - rootHeight) / 2;

    // tslint:disable-next-line:max-line-length
    return `z-index:99999;user-select:none;position: fixed;overflow: hidden;left:${rootX}px;top: ${rootY}px;width:${rootWidth}px;height:${rootHeight}px;-webkit-transform:scale(${scaleW},${scaleH});-moz-transform:scale(${scaleW},${scaleH});-ms-transform:scale(${scaleW},${scaleH});transform:scale(${scaleW},${scaleH});`;
    
};

/**
 * 函数防抖
 */
const throttle = (func) => {
    const intervel = 300;
    let lastTime = 0;

    return  () => {
        const nowTime = + new Date();
        if (nowTime - lastTime > intervel) {
            func && func();
            lastTime = nowTime;
        }
    };
};

/**
 * 拖动悬浮框
 */
const dragDom = (element, callback?) => {
    // tslint:disable-next-line:one-variable-per-declaration
    const parentNodeWidth = element.parentNode.clientWidth,parentNodeHeigth = element.parentNode.clientHeight;
    // tslint:disable-next-line:one-variable-per-declaration
    const elementWidth = element.clientWidth,elementHeight = element.clientHeight;
    const params = {
        left: 0,
        top: 0,
        currentX: 0,
        currentY: 0,
        leftLimit:parentNodeWidth - elementWidth,
        topLimit:parentNodeHeigth - elementHeight,
        flag: false
    };
    // 获取相关CSS属性
    const getCss = (o,key) => {
        return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o,<any>false)[key];     
    };
    
    // 拖拽的实现
    if (getCss(element, 'left') !== 'auto') {
        params.left = getCss(element, 'left');
    }
    if (getCss(element, 'top') !== 'auto') {
        params.top = getCss(element, 'top');
    }
    // o是移动对象
    element.ontouchstart = (event) => {
        console.log('onmousedown');
        params.flag = true;
        event = event || window.event;
        params.currentX = event.changedTouches[0].clientX;
        params.currentY = event.changedTouches[0].clientY;
    };
    element.ontouchend = () => {
        console.log('onmouseup');
        params.flag = false;    
        if (getCss(element, 'left') !== 'auto') {
            params.left = getCss(element, 'left');
        }
        if (getCss(element, 'top') !== 'auto') {
            params.top = getCss(element, 'top');
        }
        callback && callback();
    };
    document.ontouchmove = (event:any) => {
        console.log('onmousemove');
        event = event || window.event;
        if (params.flag) {
            // tslint:disable-next-line:one-variable-per-declaration
            const nowX = event.changedTouches[0].clientX, nowY = event.changedTouches[0].clientY;
            // tslint:disable-next-line:one-variable-per-declaration
            const disX = nowX - params.currentX, disY = nowY - params.currentY;
            // tslint:disable-next-line:one-variable-per-declaration
            let nowLeft = parseInt(<any>params.left,10) + disX,nowTop = parseInt(<any>params.top,10) + disY;
            nowLeft = nowLeft < 0 ? 0 : (nowLeft > params.leftLimit ? params.leftLimit : nowLeft);
            nowTop = nowTop < 0 ? 0 : (nowTop > params.topLimit ? params.topLimit : nowTop);
            element.style.left =  `${nowLeft}px`;
            element.style.top =   `${nowTop}px`;
        }
    };    
};