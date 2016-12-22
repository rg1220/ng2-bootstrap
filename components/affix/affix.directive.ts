import { Directive, OnInit, Input, Output, EventEmitter, ElementRef, OnDestroy, HostBinding } from '@angular/core';
import { PositionService } from '../position';

export enum AffixStatus {AFFIX, AFFIX_TOP, AFFIX_BOTTOM}

export class AffixStatusChange {
    public constructor(public oldStatus:AffixStatus, public newStatus:AffixStatus) {
    }
}

@Directive({
    selector: '[affix]'
})
export class AffixDirective implements OnInit, OnDestroy {

    @Input()
    public affixOffsetTop:number = 0;
    @Input()
    public affixOffsetBottom:number = 0;

    @Output()
    public affixChange:EventEmitter<AffixStatusChange> = new EventEmitter(false);

    @HostBinding('class.affix')
    private isAffix:boolean = true;
    @HostBinding('class.affix-top')
    private isAffixedTop:boolean = true;
    @HostBinding('class.affix-bottom')
    private isAffixedBottom:boolean = true;
    @HostBinding('style.top.px')
    private top:number;

    private positionService: PositionService = new PositionService();
    private status:AffixStatus;
    private body:HTMLBodyElement;
    private window:Window;
    private pinnedOffset:number;
    private debouncedCheckPosition:Function = AffixDirective.debounce(() => this.checkPosition(), 5);

    private static debounce(func:Function, wait:number):Function {
        let timeout:any;
        let args:Array<any>;
        let timestamp:number;

        return function ():any {
            // save details of latest call
            args = [].slice.call(arguments, 0);
            timestamp = Date.now();

            // this is where the magic happens
            let later = function ():any {

                // how long ago was the last call
                let last = Date.now() - timestamp;

                // if the latest call was less that the wait period ago
                // then we reset the timeout to wait for the difference
                if (last < wait) {
                    timeout = setTimeout(later, wait - last);
                    // or if not we can null out the timer and run the latest
                } else {
                    timeout = undefined;
                    func.apply(this, args);
                }
            };

            // we only need to set the timer now if one isn't already running
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
        };
    };

    public constructor(private el:ElementRef) {
        this.body = el.nativeElement.ownerDocument.body;
        this.window = el.nativeElement.ownerDocument.defaultView;
    }

    public ngOnInit():any {
        this.el.nativeElement.ownerDocument.defaultView.addEventListener('scroll', this.eventListener);
        this.checkPosition();
    }

    public ngOnDestroy():any {
        this.el.nativeElement.ownerDocument.defaultView.removeEventListener('scroll', this.eventListener);
        return undefined;
    }

    private eventListener:Function = () => this.debouncedCheckPosition();

    private checkPosition():void {
        let elemPos = this.positionService.position(this.el.nativeElement);
        if (elemPos.height === 0 || elemPos.width === 0) {
            // Element is not visible
            return;
        }

        let scrollHeight:number = Math.max(this.window.innerHeight, this.body.scrollHeight);
        let nativeElemPos:{width:number, height:number, top:number, left:number} = this.positionService.offset(this.el.nativeElement);
        let newAffixStatus:AffixStatus = this.getState(scrollHeight, nativeElemPos, this.affixOffsetTop, this.affixOffsetBottom);

        if (this.status !== newAffixStatus) {
            this.top = newAffixStatus === AffixStatus.AFFIX_BOTTOM ? this.getPinnedOffset() : undefined;

            this.affixChange.emit(new AffixStatusChange(this.status, newAffixStatus));
            this.status = newAffixStatus;
            this.isAffix = false;
            this.isAffixedBottom = false;
            this.isAffixedTop = false;
            switch (this.status) {
                case AffixStatus.AFFIX_TOP:
                    this.isAffixedTop = true;
                    break;
                case AffixStatus.AFFIX_BOTTOM:
                    this.isAffixedBottom = true;
                    break;
                default:
                    this.isAffix = true;
                    break;
            }
        }

        if (newAffixStatus === AffixStatus.AFFIX_BOTTOM) {
            this.top = scrollHeight - nativeElemPos.height - this.affixOffsetBottom;
        }
    }

    private getState(scrollHeight:number, nativeElemPos:{width:number, height:number, top:number, left:number}, offsetTop:number, offsetBottom:number):AffixStatus {
        let scrollTop:number = this.body.scrollTop; // current scroll position in pixels from top
        let targetHeight:number = this.window.innerHeight; // Height of the window / viewport area

        if (offsetTop !== undefined && this.status === AffixStatus.AFFIX_TOP) {
            if (scrollTop < offsetTop) {
                return AffixStatus.AFFIX_TOP;
            }
            return AffixStatus.AFFIX;
        }

        if (this.status === AffixStatus.AFFIX_BOTTOM) {
            if (offsetTop !== undefined) {
                if (scrollTop + this.pinnedOffset <= nativeElemPos.top) {
                    return AffixStatus.AFFIX;
                }
                return AffixStatus.AFFIX_BOTTOM;
            }
            if (scrollTop + targetHeight <= scrollHeight - offsetBottom) {
                return AffixStatus.AFFIX;
            }
            return AffixStatus.AFFIX_BOTTOM;
        }

        if (offsetTop !== undefined && scrollTop <= offsetTop) {
            return AffixStatus.AFFIX_TOP;
        }

        let initializing:boolean = this.status === undefined;
        let lowerEdgePosition:number  = initializing ? scrollTop + targetHeight : nativeElemPos.top + nativeElemPos.height;
        if (offsetBottom !== undefined && (lowerEdgePosition >= scrollHeight - offsetBottom)) {
            return AffixStatus.AFFIX_BOTTOM;
        }

        return AffixStatus.AFFIX;
    }

    private getPinnedOffset():number {
        if (this.pinnedOffset !== undefined) {
            return this.pinnedOffset;
        }
        let scrollTop:number = this.body.scrollTop;
        let position:{width:number, height:number, top:number, left:number} = this.positionService.offset(this.el.nativeElement);

        this.pinnedOffset = position.top - scrollTop;
        return this.pinnedOffset;
    }
}
