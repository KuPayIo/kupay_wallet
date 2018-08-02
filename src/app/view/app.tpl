<div style="height: 100%;" ev-change-tab="tabChangeTo">
    <widget w-tag="{{it1.tabBarList[it1.isActive].components}}"></widget>
    <div w-class="ga-bottom-tab-bar-container" >
        {{for index,item of it1.tabBarList}}
        <div w-class="ga-tab-bar-item {{it1.isActive == index ? 'ga-tab-bar-item-active' : ''}}" on-tap="tabBarChangeListener(e,{{index}})">
            <img src="../res/image/{{it1.isActive == index ? item.iconActive : item.icon}}" w-class="ga-tab-bar-icon {{index===2 ? 'iconCenter' : ''}}" />
            <span w-class="ga-tab-bar-text">{{item.text}}</span>
        </div>
        {{end}}
    </div>
</div>