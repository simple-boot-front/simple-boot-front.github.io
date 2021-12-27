import { getRouter, Route, Router, Sim } from 'simple-boot-core/decorators/SimDecorator';
import { Component } from 'simple-boot-front/decorators/Component';
import { FrontIntroduction } from './pages/front-introduction/front-introduction';
import template from './index.router.html'
import style from './index.router.css'
import {OnInit} from 'simple-boot-front/lifecycle/OnInit';
import {RouterAction} from 'simple-boot-core/route/RouterAction';
import {Navigation} from 'simple-boot-front/service/Navigation';
import {FrontQuickstart} from './pages/front-quickstart/front-quickstart';
import {FrontComponent} from './pages/front-component/front-component';
import {FrontRouter} from './pages/front-router/front-router';
import {FrontScript} from './pages/front-script/front-script';
import {DomrenderIntroduction} from './pages/domrender-introduction/domrender-introduction';
import {DomrenderQuickstart} from './pages/domrender-quickstart/domrender-quickstart';
import {DomrenderFunction} from './pages/domrender-function/domrender-function';
import {DomrenderScript} from './pages/domrender-script/domrender-script';
import {DomrenderComponent} from './pages/domrender-component/domrender-component';
import {DomrenderValidation} from './pages/domrender-validation/domrender-validation';
import {DomrenderDetect} from './pages/domrender-detect/domrender-detect';
import {DomrenderConfig} from './pages/domrender-config/domrender-config';
import {DomrenderProxy} from './pages/domrender-proxy/domrender-proxy';
import {DomrenderClass} from './pages/domrender-class/domrender-class';
import {FrontOption} from './pages/front-options/front-option';
import {CoreAdvice} from './pages/core-advice/core-advice';
import {CoreIntroduction} from './pages/core-introduction/core-introduction';
import {CoreQuickstart} from './pages/core-quickstart/core-quickstart';
import {CoreRouter} from './pages/core-router/core-router';
import {CoreIntent} from './pages/core-intent/core-intent';
import {CoreAop} from './pages/core-aop/core-aop';
import {CreateIntroduction} from './pages/create-introduction/create-introduction';
import {CliIntroduction} from './pages/cli-introduction/cli-introduction';
declare const bootstrap: any;
declare const feather: any;
declare const hljs: any;
@Sim()
@Router({
    path: '',
    route: {
        '/': '/simple-boot-front/introduction',
        '/simple-boot-front/introduction': FrontIntroduction,
        '/simple-boot-front/quick-start': FrontQuickstart,
        '/simple-boot-front/component': FrontComponent,
        '/simple-boot-front/router': FrontRouter,
        '/simple-boot-front/script': FrontScript,
        '/dom-render/introduction': DomrenderIntroduction,
        '/dom-render/quick-start': DomrenderQuickstart,
        '/dom-render/function': DomrenderFunction,
        '/dom-render/script': DomrenderScript,
        '/dom-render/component': DomrenderComponent,
        '/dom-render/validation': DomrenderValidation,
        '/dom-render/class': DomrenderClass,
        '/dom-render/proxy': DomrenderProxy,
        '/dom-render/detect': DomrenderDetect,
        '/dom-render/config': DomrenderConfig,
        '/simple-boot-front/config-option': FrontOption,
        '/simple-boot-core/introduction': CoreIntroduction,
        '/simple-boot-core/quick-start': CoreQuickstart,
        '/simple-boot-core/router': CoreRouter,
        '/simple-boot-core/intent': CoreIntent,
        '/simple-boot-core/aop': CoreAop,
        '/simple-boot-core/advice': CoreAdvice,
        '/create-simple-boot-front/introduction': CreateIntroduction,
        '/simple-boot-front-cli/introduction': CliIntroduction

    }
})
@Component({
    template,
    styles: [style],
})
export class IndexRouter implements OnInit, RouterAction {
    child?: any;
    private route: Route;
    private category?: HTMLSelectElement;
    private detail?: HTMLSelectElement;
    public detailsItems: string[] = [];
    public defaultAutoSeconds = 10;
    public autoSeconds = this.defaultAutoSeconds;
    public forceAutoStop = false;
    public footer?: Element;
    // public autoInterval?: any;
    private autoInterval?: NodeJS.Timer;
    constructor(public navagation: Navigation) {
        const data = getRouter(this)!;
        this. route = data.route;
    }

    onInit(): void {
        this.detailsItems = this.getDetails(this.category?.value);
    }


    changeCategory(data: string) {
        this.detailsItems = this.getDetails(data);
    }

    changeDetail(data: string) {
        if (data) {
            this.navagation.go(data);
        }
    }

    getPath(depth: number) {
        return this.navagation.path?.split('/')[depth] ?? '';
    }

    getDetails(prefix: string = '') {
        return Object.entries(this.route).filter(([k, v]) => k.split('/')[1] === prefix).map(([k, v]) => k)
    }

    async canActivate(url: any, module: any) {
        window.scrollTo(0, 0);
        this.child = module;
        // hljs.highlightAll();
        feather.replace({ 'aria-hidden': 'true' })
        document.querySelectorAll('.code-container').forEach(el => {
            hljs.highlightElement(el);
        });
    }

    hasActivate(checkObj: any): boolean {
        return this.child === checkObj;
    }
}