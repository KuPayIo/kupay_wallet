<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="ga-bottom-container">
        <div w-class="ga-btns"><span w-class="ga-btn" on-tap="cancelClick">取消</span><span w-class="ga-btn ga-ok-btn" on-tap="okClick">确定</span></div>
        <div w-class="ga-top-mask"></div>
        <div w-class="ga-data-container">
            <ul w-class="ga-items" id="wheelview-ul">
                <div w-class="ga-space"></div>
                {{for index,item of it.dataList}}
                <li w-class="ga-item">{{item}}</li>
                {{end}}
                <div w-class="ga-space"></div>
            </ul>
        </div>
        <div w-class="ga-bottom-mask"></div>
    </div>
</div>