<div w-class="modal-mask" >
    <div w-class="body">
        <img src="../../res/image/redEnvBack.png" style="height: auto;width: 100%;position: fixed;"/>
        <img w-class="clear" src="../../res/image/30_gray.png" on-tap="backPrePage('')"/>
        <div w-class="title">{{it.message}}</div>
        <div w-class="content">{{it.tag}}</div>
        <div style="position: absolute;margin-top: 590px;text-align: center;width: 100%;transform: perspective(1000);">
            <img w-class="sendRedBtn {{it.openClick ? 'sendRedBtnClick' : ''}}" src="../../res/image/openRedEnv.png" on-tap="openRedEnv"/>
        </div>
    </div>
</div>