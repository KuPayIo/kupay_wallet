/**
 * 下拉刷新
 */
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
interface Props {
    loaded: boolean;// 是否加载完
    top:string;// 刷新图标距离顶部的距离
}

interface Option {
    container: any;
}

export class TopRefresh extends Widget {
    public props: Props;
    public option: Option;
    public loading: any;

    constructor() {
        super();
        this.props = {
            loaded: false,
            top:'0'
        };

    }

    public setProps(props: Props, oldProps?: Props): void {
        props = {
            ...this.props,
            ...props
        };
        try {
            this.loading.style.top = '-100px';
        } catch (e) {

        }
        super.setProps(props, oldProps);
    }

    public beforeUpdate(): void {
        super.beforeUpdate();
        if (this.props.loaded) {
            try {
                this.slide({ container:this.parentNode.parent.widget.tree.link });
            } catch (e) {
                console.log(e);
            }

        }
    }

    public attach(): void {
        super.attach();
        console.log(this.parentNode.parent.link);
       // let ss=this.parentNode.parent.widget.tree.link
        // let a=this.parentNode.parent.link;
        try {
            this.slide({ container: this.parentNode.parent.widget.tree.link });
        } catch (e) {
            console.log(e);
        }

    }

    public destroy(): boolean {
        return super.destroy();
    }

    public slide(option: Option) {
        const _this = this;
        let start_location,
            end_location,
            isLock = false,// 是否锁定整个操作
            isCanDo = false,// 是否移动滑块
            isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
            hasTouch = 'ontouchstart' in window && !isTouchPad;

        const obj = option.container;

        this.loading = this.tree.link;

        const offset = this.loading.clientHeight;

        this.loading.style.left = (obj.clientWidth / 2 - offset / 2) + 'px';

        const objparent = obj.parentElement;
        /*操作方法*/
        const fn = {
                // 移动容器
            translateLoading(flag: boolean) {
                if (flag) {
                    _this.loading.style.top = _this.props.top;
                } else {
                    _this.loading.style.top = '-100px';
                }

            },
                // 返回到初始位置
            back() {
                fn.translateLoading(false);
                    // 标识操作完成
                isLock = false;
                _this.props.loaded = false;
            },
            addEvent(element, event_name, event_fn) {
                if (element.addEventListener) {
                    element.addEventListener(event_name, event_fn, false);
                } else if (element.attachEvent) {
                    element.attachEvent('on' + event_name, event_fn);
                } else {
                    element['on' + event_name] = event_fn;
                }
            }
        };
        fn.addEvent(obj, 'touchstart', start);
        fn.addEvent(obj, 'touchmove', move);
        fn.addEvent(obj, 'touchend', end);
        fn.addEvent(obj, 'mousedown', start);
        fn.addEvent(obj, 'mousemove', move);
        fn.addEvent(obj, 'mouseup', end);

        // 滑动开始
        function start(e) {
            if (objparent.scrollTop <= 0 && !isLock) {
                const even = typeof event === 'undefined' ? e : event;
                // 标识操作进行中
                isLock = true;
                isCanDo = true;
                // 保存当前鼠标Y坐标
                start_location = hasTouch ? even.touches[0].pageY : even.pageY;
                // 消除滑块动画时间
            }
            return false;
        }

        // 滑动中
        function move(e) {
            if (objparent.scrollTop <= 0 && isCanDo) {
                const even = typeof event === 'undefined' ? e : event;
                // 保存当前鼠标Y坐标
                end_location = hasTouch ? even.touches[0].pageY : even.pageY;
            }
        }

        // 滑动结束
        function end(e) {
            if (isCanDo) {
                isCanDo = false;
                // 判断是否滚动到顶部
                    // 判断滑动距离是否大于等于指定值
                if ((end_location - start_location >= offset) && _this.parentNode.parent.link.scrollTop === 0) {

                        // 在刷新前做的事情  一般设置父组件传入的loaded为false
                    notify(_this.parentNode, 'ev-before-load', { value: null });
                    _this.props.loaded = false;
                        // 移动loading
                    fn.translateLoading(true);
                        // 在刷新做的事情
                    notify(_this.parentNode, 'ev-loaded', { value: null });

                } else {
                        // 返回初始状态
                    fn.back();
                }

            }
        }
    }

}
