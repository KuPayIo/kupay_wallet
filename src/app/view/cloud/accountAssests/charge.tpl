<diV w-class="chargePage">
        {{for i,v of it1.infoList}}
        <div w-class="items">
                <img src="../../../res/image/cloud_charge_icon.png" w-class="itemIcon" />
                <div w-class="info">
                        <p w-class="behavior">充值</p>
                        <p w-class="time">{{v.timeShow}}</p>
                </div>
                <div w-class="amount">
                        <p>{{v.amount}}</p>
                        <p w-class="statas" style="color: {{v.status === 1 ? '#8E96AB' : ''}};">{{v.statusShow}}</p>
                </div>
        </div>
        {{end}}
</diV>