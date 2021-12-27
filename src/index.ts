import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
import {SimFrontOption, UrlType} from 'simple-boot-front/option/SimFrontOption';
import {IndexRouter} from './index.router';

function start() {
    let simFrontOption = new SimFrontOption(window).setUrlType(UrlType.hash)
    const simpleApplication = new SimpleBootFront(IndexRouter, simFrontOption);
    return simpleApplication;
}
start().run();
