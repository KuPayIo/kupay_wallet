<diV w-class="withdrawPage">
        {{for i,v of it1.infoList}}
        <div w-class="items">
                <img src="../../../res/image/{{v.behaviorIcon}}" w-class="itemIcon" />
                <div w-class="info">
                        <p w-class="behavior">{{v.behavior}}</p>
                        <p w-class="time">{{v.time}}</p>
                </div>
                <div w-class="amount">
                        <p>{{v.amount}}</p>
                        <p w-class="statas" style="color: {{v.status=='完成' ? '#8E96AB' : ''}};">{{v.status}}</p>
                </div>
        </div>
        {{end}}
</diV>