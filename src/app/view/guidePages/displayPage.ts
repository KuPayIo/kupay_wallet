/**
 * financial management home page
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { Swiper } from '../../res/js/swiper.min';
import { guidePages } from '../../utils/constants';

export class DisplayPage extends Widget {
    public ok :() => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            guidePages,
            activeIndex:0
        };
    }

    public attach() {
        super.attach();
        // tslint:disable-next-line:no-this-assignment
        const that = this;
        const mySwiper = new Swiper ('.swiper-container', {
            autoplay:false,
            on:{
                slideChangeTransitionStart:function() {
                    that.state.activeIndex = this.activeIndex;
                    that.paint();
                }
            }
        }); 
    }

    public doNextClick() {
        popNew('app-view-app');
        this.ok && this.ok();
    }
}