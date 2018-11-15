<div class="new-page" w-class="new-page">
    <div w-class="topBack">
        <img src="../../../res/image1/topbar_backimg.png" w-class="backImg"/>
        <app-components1-topBar-topBar1>{avatar:{{it.avatar}} }</app-components1-topBar-topBar1>
    </div>
   
    <div w-class="body">
        <div w-class="games1" on-tap="enterGames2Click">
            <img src="../../../res/image1/game2.jpg"/>
            <div w-class="item-box">
                <div w-class="game-desc"><pi-ui-lang>{"zh_Hans":"新一代区块链游戏","zh_Hant":"新一代區塊鏈遊戲","en":""}</pi-ui-lang></div>
                <div w-class="game-title">Crypto Fishing</div>
            </div>
        </div>
        <div w-class="hot-games">
            <div w-class="hot-game-title"><pi-ui-lang>{"zh_Hans":"热门DApp","zh_Hant":"熱門DApp","en":""}</pi-ui-lang></div>
            <div w-class="item" on-tap="gameClick">
                <img src="../../../res/image1/game3.jpg"/>
                <div w-class="item-box">
                    <div w-class="game-desc"><pi-ui-lang>{"zh_Hans":"基于GAIA链的新一代区块链游戏","zh_Hant":"基於GAIA鏈的新一代區塊鏈遊戲","en":""}</pi-ui-lang></div>
                    <div w-class="game-title"><pi-ui-lang>{"zh_Hans":"迷失之城","zh_Hant":"迷失之城","en":""}</pi-ui-lang></div>
                </div>
            </div>
            <div w-class="item" on-tap="gameClick">
                <img src="../../../res/image1/game4.jpg"/>
                <div w-class="item-box">
                    <div w-class="game-desc"><pi-ui-lang>{"zh_Hans":"Decentraland与Ethaemon合作","zh_Hant":"Decentraland與Ethaemon合作","en":""}</pi-ui-lang></div>
                    <div w-class="game-title">Decentraland</div>
                </div>
            </div>
        </div>
    </div>
</div>