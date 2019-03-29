<div class="new-page" w-class="new-page">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="top-bar">
        <div w-class="top-bar-container">
            <img on-tap="backPrePage" src="../../res/image/left_arrow_blue.png" w-class="ga-back" />
            <div w-class="input-father" ev-input-change="searchTextChange" ev-input-clear="searchTextClear">
                {{: Search = {"zh_Hans":"Search","zh_Hant":"Search","en":""} }}
                <app-components1-input-input>{placeHolder:{{Search}},clearable:"true",style:"background-color:#f3f6f9;",notUnderLine:true}</app-components1-input-input>
            </div>
            <div on-tap="searchClick" style="border: 24px solid transparent;">
                <pi-ui-lang>{"zh_Hans":"搜索","zh_Hant":"搜索","en":""}</pi-ui-lang>
            </div>
        </div>
    </div>
    <div w-class="body">
        {{if it.searchText && it.showGameList.length==0}}
        <div w-class="noRecord">没有找到想要的，玩玩这些游戏</div>
        {{end}}
        {{: list = it.showGameList.length > 0 ? it.showGameList :it.gameList}}
        {{for i,v of list}}
        <div w-class="gameItem">
            <img src="{{v.img[1]}}" w-class="gameImg"/>
            <span w-class="gameTitle">{{v.title.zh_Hans}}</span>
        </div>
        {{end}}
    </div>
</div>