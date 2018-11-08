<div class="new-page" w-class="new-page">
    <div w-class="topBack">
        <img src="../../../res/image1/topbar_backimg.png" w-class="backImg"/>
        <app-components1-topBar-topBar1>{avatar:{{it.avatar}} }</app-components1-topBar-topBar1>
    </div>
    <div w-class="body">
        <img src="../../../res/image1/game1.png" w-class="games1" on-tap="enterGames1Click"/>
        <div w-class="hot-games">
            <div w-class="hot-game-title">热门DApp</div>
            <div w-class="item" on-tap="gameClick">
                <img src="../../../res/image1/game2.jpg"/>
                <div w-class="item-box">
                    <div w-class="game-desc">新一代区块链游戏</div>
                    <div w-class="game-title">Crypto Fishing</div>
                </div>
            </div>
            <div w-class="item" on-tap="gameClick">
                <img src="../../../res/image1/game3.jpg"/>
                <div w-class="item-box">
                    <div w-class="game-desc">基于GAIA链的新一代区块链游戏</div>
                    <div w-class="game-title">迷失之城</div>
                </div>
            </div>
            <div w-class="item" on-tap="gameClick">
                <img src="../../../res/image1/game4.jpg"/>
                <div w-class="item-box">
                    <div w-class="game-desc">Decentraland与Ethaemon合作</div>
                    <div w-class="game-title">Decentraland</div>
                </div>
            </div>
        </div>
    </div>
</div>