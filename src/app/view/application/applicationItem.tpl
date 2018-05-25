<div w-class="applItem">
    <img src="{{it.img}}" w-class="applimg"/>
    <img w-class="appllike" src="{{it.islike?'../../res/image/btn_dapp_pick.png':'../../res/image/btn_dapp_heart.png'}}" on-tap="likeit"/>  
    <div w-class="appltitle">{{it.title}}</div>
    <div w-class="applmess">{{it.mess}}</div>
</div>