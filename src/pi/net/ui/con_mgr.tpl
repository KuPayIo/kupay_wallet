{{let con=["连接初始化...","连接中...","已连接","连接已断开"]}} 
{{let login=["登录初始化...","登录中...","已登录","重登中...","登出中...","已登出","登录错误"]}}
<div style="display:{{ it.login!=2 || it.con!=2?'block':'none'}};position:absolute;top:0;left:0;width: 100%;height: 100%;font-size: 20px;color: #fff;z-index:200;">
    {{if false}}
        {{if it.con!=2}}
            <span>{{con[it.con]}}</span>
        {{else}}
            <span>{{login[it.login]}}</span>
        {{end}}
    {{end}}
    <div style="position:absolute;top:0;left:0;width: 100%;height: 100%;background: #000;opacity: 0.3;"></div>
    <div style="width:80px;height:40px;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;">
        <div style="width:80px;height:30px;text-align:center;">连接中</div>
        <div style="width:40px;height:20px;background-image:url(./loading.gif);background-size:contain;background-repeat: no-repeat;margin:0 auto;"></div>
    </div>
</div>