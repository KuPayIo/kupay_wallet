<div w-class="ga-display-page" class="swiper-container">
    <div w-class="swiper-wrapper" class="swiper-wrapper">
        {{for index,item of it1.guidePages}}
        <div w-class="swiper-slide" class="swiper-slide">
            <div w-class="ga-display-img-container">
                <div style="background-image:url(../../res/image/{{item.imgUrl}});" w-class="ga-display-img"></div>
            </div>
            <p w-class="ga-intro">{{item.text}}</p>
        </div>
        {{end}}
        <div w-class="swiper-slide" class="swiper-slide"><app-view-app></app-view-app></div>
    </div>
    <div w-class="ga-pagination">
        {{for index,item of it1.guidePages}}
            <span w-class="{{it1.activeIndex === index ? 'ga-dot ga-dot-active' : 'ga-dot'}}"></span>
        {{end}}
    </div>
</div>