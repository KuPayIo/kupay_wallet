<div class="new-page" w-class="new-page">
    <div w-class="body">
        <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
        <div w-class="myInfoBox">
            <div w-class="avatarBox">
                <widget w-tag="app-components1-img-img" w-class="userHead" on-tap="userInfoSet">{imgURL:{{it.userInfo.avatar}},width:"140px;"}</widget>
                <div w-class="userInfo">
                    <div w-class="userNameBox">
                        <div w-class="userName">{{it.userInfo.nickName}}</div>
                        {{if it.user.sex!=2}}
                        <img src="../../../res/image/{{it.user.sex==0?'boy.png':'girl.png'}}" alt="" w-class="sex"/>
                        {{end}}
                        <img src="{{it.medalest}}" alt="" w-class="medal" on-tap="showMyMedal"/>
                    </div>
                    <div w-class="haihaiBox">嗨号：{{ it.user.acc_id }}</div>
                </div>
            </div>
            <div w-class="myMoney">
                {{for i,v of it1.wallet}}
                <div w-class="btnBox">
                    <div w-class="silver">
                        <div w-class="money">{{v.num}}</div>
                        <div w-class="moneyName">{{v.name}}</div>
                    </div>
                </div>
                {{end}}
            </div>
            <div w-class="dividend" on-tap="dividend">距离分红 20 天</div>
        </div>
        
        <div w-class="friendList">
            {{for i,v of it.showDataList}}
            <div w-class="fan">
                <div w-class="num">{{v.num}}</div>
                <div w-class="fanName">{{v.name}}</div>
            </div>
            {{end}}
        </div>
        <div w-class="moreTitle" on-tap="test">更多</div>
        <div w-class="more">
            {{for i,v of it.mallFunction}}
            <div w-class="mallFunction" on-tap="funClick(e,{{i}})">
                <div w-class="iconBox">
                    <img src="{{v.src}}" alt="" w-class="iocn"/>
                    {{if v.fg}}
                    <img src="../../res/image/mallFunction/redDot.png" alt="" w-class="redDot"/>
                    {{end}}
                </div>
                <div w-class="iconName" style="width:{{i==2?'120px':'100px'}}">{{v.name}}</div>
            </div>
            {{end}}
        </div>
    </div>
</div>