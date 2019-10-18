<div class="new-page" w-class="newpage" ev-next-click="toSearch">
    <div w-class="topBack" ev-myHome="myHome">
        <app-components1-topBar-topBar1>{avatar:{{it.userInfo.avatar}},title:"游戏" }</app-components1-topBar-topBar1>
    </div>
    <app-components1-offlineTip-offlineTip>{ offlienType:{{it.offlienType}} }</app-components1-offlineTip-offlineTip>
    <div w-class="body">
        <div w-class="oftenPlay">
            <div w-class="oftenList">
                {{for i,v of it.oftenList}}
                <div w-class="listItem" on-tap="goGame({{i}})">
                    <div w-class="oftenPlayItem">
                        <img src="{{v.icon}}" alt="" w-class="oftenPlayItemImg"/>
                        <div w-class="mark">最近在玩</div>
                    </div>
                    <div w-class="gameName">{{v.name}}</div>
                </div>
                {{end}}
                {{if it.oftenList.length < 4 }}
                    {{for i,v of it.recommend}}
                    <div w-class="listItem">
                        <div w-class="recommend">
                            <img src="{{v.icon}}" alt="" w-class="recommendImg"/>
                            <img src="../../../res/image/hot.png" alt="" w-class="markImg"/>
                        </div>
                        <div w-class="gameName">{{v.name}}</div>
                    </div>
                    {{end}}
                {{end}}
            </div>
        </div>
        <div w-class="recommendedToday">
            <div w-class="recommendedTodayTitle">今日推荐</div>
            <div w-class="showGame" style="position: relative">
               <div w-class="userHead">
                    <div w-class="gameImg" on-tap="gameClick1">
                        <img src="{{it.recommendedToday.bg}}" loading="lazy" w-class="userHead" />
                    </div>
                    <div w-class="gameInfos">
                        <div style="margin:0 15px 20px 15px; display: flex;">
                            <img src="{{it.recommendedToday.icon}}" loading="lazy" alt="" w-class="gameInfoImg"/>
                            <div w-class="gameInfoName" style="marign-left:20px;">
                                <div w-class="gameInfosName">{{it.recommendedToday.name}}</div>
                                <div w-class="publishTime">{{it.recommendedToday.desc}}</div>
                            </div>
                        </div>
                    </div>
               </div>
            </div>
        </div>

        <div w-class="recommendedToday">
            <div w-class="recommendedTodayTitle">热门</div>
            <div w-class="showGame" style="height:430px;">
                {{for i,v of it.popular}}
                <div w-class="item1">
                    <div w-class="gameImg">
                        <img src="{{v.bg}}" w-class="userHead" />
                    </div>
                    <div w-class="gameInfo">
                        <div w-class="gameInfoName" style="height:100%;margin: 0 20px;width: 100%;">
                            <div w-class="gameInfosName">{{v.name}}</div>
                            <div w-class="publishTime">{{v.desc}}</div>
                        </div>
                    </div>
                </div>
                {{end}}
            </div>
        </div>

        <div w-class="recommendedToday">
            <div w-class="recommendedTodayTitle">编辑推荐</div>
            <div w-class="showGame" style="position: relative;height:400px;">
                <div w-class="gameImg">
                    <img src="{{it.editRecommend.bg}}" w-class="userHead" />
                </div>
            </div>
            <div w-class="editList">
                <img src="{{it.editRecommend.icon}}" alt="" w-class="gameInfoImg"/>
                <div w-class="gameInfoName">
                    <div w-class="gameInfosNames">{{it.editRecommend.name}}</div>
                    <div w-class="publishTime">{{it.editRecommend.desc}}</div>
                </div>
            </div>
        </div>

        <div w-class="recommendedToday">
            <div w-class="recommendedTodayTitle">全部游戏</div>
            {{for i,v of it.allGame}}
            <div w-class="allGameList">
                <div style="display:flex;">
                    <img src="{{v.icon}}" alt="" w-class="allGameImg"/>
                    <div w-class="allGameInfo">
                        <div w-class="allGameName">{{v.name}}</div>
                        <div w-class="allGamePublishTime">{{v.desc}}</div>
                    </div>
                </div>
                <div w-class="btn">马上玩</div>
            </div>
            {{end}}
        </div>
    </div>
</div>