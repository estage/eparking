import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import {MapHomeCtrl} from "../pages/map/map-home";
import {SearchCtrl} from "../pages/map/search";
import {NearbyCtrl} from "../pages/map/nearby";
import {MapCtrl} from "../pages/map/map";
import {MapService} from "../pages/map/map.service";
import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    MapHomeCtrl,
    SearchCtrl,
    NearbyCtrl,
    MapCtrl,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      iconMode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'bottom',
      pageTransition: 'ios',
      tabsHideOnSubPages: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    MapHomeCtrl,
    SearchCtrl,
    NearbyCtrl,
    MapCtrl
  ],
  providers: [
    Geolocation,StatusBar, SplashScreen,
    MapService, {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
