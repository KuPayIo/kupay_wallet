<diV w-class="withdrawPage">
        {{for i,v of it1.infoList}}
        <div w-class="items">
                <img src="../../../res/image/cloud_withdraw_icon.png" w-class="itemIcon" />
                <div w-class="info">
                        <p w-class="behavior">提币</p>
                        <p w-class="time">{{v.timeShow}}</p>
                </div>
                <div w-class="amount">
                        <p>{{v.amount}}</p>
                        <p w-class="statas" style="color: {{v.status === 0 ? '#E1953C' : ''}};">{{v.statusShow}}</p>
                </div>
        </div>
        {{end}}
</diV>