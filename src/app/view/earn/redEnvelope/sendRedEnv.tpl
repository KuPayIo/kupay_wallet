<div w-class="modal-mask" >
    <div w-class="body">
        <img src="../../../res/image/redEnvBack.png" style="height: auto;width: 100%;position: fixed;"/>
        <img w-class="clear" src="../../../res/image/whiteClose.png" on-tap="backPrePage"/>
        <div w-class="title">{{it1.cfgData.title}}</div>
        <div w-class="content">{{it.message}}</div>
        <div style="position: absolute;margin-top: 590px;text-align: center;width: 100%;">
            <img w-class="sendRedBtn" src="../../../res/image/sendRedEnv.png" on-tap="sendRedEnv"/>
        </div>
    </div>
</div>