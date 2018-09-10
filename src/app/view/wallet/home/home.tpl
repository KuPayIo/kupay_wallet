<div class="new-page" w-class="new-page">
    <div w-class="title-container">
        <div w-class="user-container">
            <img src="{{it1.avatar ? it1.avatar : '../../../res/image1/default_avatar.png'}}" w-class="avatar"/>
            <div w-class="total-asset">￥{{it1.totalAsset}}</div>
        </div>
        <div w-class="nav-wrap">
            <div w-class="nav">
                {{for i,v of it1.tabs}} {{let isActive = i===it1.activeNum}}
                <div w-class="nav-item {{isActive ? 'is-active' : ''}}" on-tap="tabsChangeClick(e,{{i}})">
                    {{v.tab}}
                </div>
                {{end}}
            </div>
        </div>
    </div>
    {{for i,v of it1.tabs}} {{let isActive = i===it1.activeNum}}
    <widget w-tag={{v.components}} style="visibility: {{isActive ? 'visible' : 'hidden'}}; z-index:{{isActive ? 0 : -1}};  width:100%;{{isActive ? 'flex:1 0 0;' : ''}}">{isActive:{{isActive}}}</widget>
    {{end}}
</div>