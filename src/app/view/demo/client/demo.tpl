<div class="new-page" style="font-size:40px;" >
    <div on-tap="returnFunc">点我关闭页面</div>
    <span >设置用户名</span>
    <div ev-input-text="setId">
        <span>请输入id</span>
        <pi-ui-input></pi-ui-input> 
    </div>   
    <div ev-input-text="setName">
        <span>请输入用户名</span>
        <pi-ui-input></pi-ui-input>    
    </div>   
    <div on-tap="rpcSet">点我设置用户信息</div>
    <div on-tap="rpcGet">点我获取用户信息</div>
    <span>获取用户名</span>
    <div ev-input-text="getId">
        <span>请输入id</span>
        <pi-ui-input></pi-ui-input>   
    </div> 
    <span>用户名为{{it.name2}}</span>
</div>