<div w-class="container" class="award-gift-item">
    <div w-class="box" style="width: {{it.width}}px;height: {{it.width}}px;backgroundColor: #dddddd;">
        <div w-class="clip" style="width: {{it.width}}px;height: {{it.width}}px;border: {{it.borderWidth}}px solid #dddddd;clip:{{it.activePercent >= 0.5 ? 'auto' : 'rect(0, ' + it.width + 'px,' + it.width + 'px,' + it.width/2 + 'px)'}};transform: rotateY(180deg);">
            <div w-class="left" style="width: {{it.width}}px;height: {{it.width}}px;border: {{it.borderWidth}}px solid {{it.activeColor}};clip: rect(0, {{it.width/2}}px, {{it.width}}px, 0);top:{{-it.borderWidth}}px;left:{{-it.borderWidth}}px;transform:rotate({{Math.ceil(it.activePercent * 360)}}deg);"></div>
            <div w-class="right" style="width: {{it.activePercent >= 0.5 ? it.width : 0}}px;height: {{it.width}}px;border: {{it.borderWidth}}px solid {{it.activeColor}};clip: rect(0, {{it.width}}px, {{it.width}}px, {{it.width/2}}px);top:{{-it.borderWidth}}px;left:{{-it.borderWidth}}px;"></div>
        </div>
        <div w-class="gift-box" style="{{it.centerStyle}};background-image: url({{it.centerImage}});width: {{it.width - it.borderWidth * 2}}px;height:{{it.width - it.borderWidth * 2}}px;color:{{it.activePercent>0?it.activeColor:'#888888'}}">
        </div>
    </div>
    <div w-class="first-text">{{it.firstText}}</div>
    {{if it.secondText}}
    <div w-class="second-text">{{it.secondText}}</div>
    {{end}}
</div>