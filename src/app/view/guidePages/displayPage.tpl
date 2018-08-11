<div w-class="ga-display-page" class="swiper-container">
    <div w-class="swiper-wrapper" class="swiper-wrapper">
        {{for index,item of it1.guidePages}}
        <div w-class="swiper-slide" class="swiper-slide" style="background-image:url(../../res/image/{{item.imgUrl}});">
            {{if index === it1.guidePages.length - 1}}
            <div w-class="do-next" on-tap="doNextClick">立即体验</div>
            {{end}}
        </div>
        {{end}}
    </div>
    <div w-class="ga-pagination">
        {{for index,item of it1.guidePages}}
            <span w-class="{{it1.activeIndex === index ? 'ga-dot ga-dot-active' : 'ga-dot'}}"></span>
        {{end}}
    </div>
</div>