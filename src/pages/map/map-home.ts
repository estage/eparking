import { ViewChild,Component } from '@angular/core';
import { NavController, Platform, Searchbar,LoadingController, Loading, AlertController,ToastController } from 'ionic-angular';
import { MapService } from "./map.service";
import { Observable } from 'rxjs/observable';
import { NearbyCtrl } from "./nearby";
import {BaseCtrl} from "../base-ctrl";

import 'rxjs/add/operator/map';

declare var AMap;

@Component({
  templateUrl: 'map-home.html'
})


export class MapHomeCtrl extends BaseCtrl{
   @ViewChild('searchbar') searchbar: Searchbar;
  openLinkOptions = "location=no,closebuttoncaption=返回";
  loader: Loading;
  private localized: boolean = false;
  obj :any;
  locationLng :any;
  locationLat :any;
  private map = null;
  private parkingLotInfo :any;
  places: Array<any> = [];
  showContainer: boolean = true;

  constructor(public loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private platform: Platform,
    private mapService: MapService,
    protected toastCtrl: ToastController,
    protected alertCtrl: AlertController) {
      super(alertCtrl, toastCtrl, loadingCtrl);
  }

  ngOnInit() {
    const loader = this.loadingCtrl.create({
      content: "正在加载中...",
      spinner: 'hide',
      showBackdrop: true
    });
    this.loader = loader;
    loader.present();
  }

  /***
   * 地图加载完毕
   */
  onMapReady() {
    console.log("onMapReady");
    this.platform.ready().then(() => {
      this.locate().subscribe(() => {
        console.log("定位成功");
        const mapElement: Element = this.mapService.mapElement;
        if (mapElement) {
          console.log("显示当前位置");
          mapElement.classList.add('show-map');
        }
      }, error => {
        console.log(error);
      });
      this.initMarker();

    });
  }

  /**
   * 获取当前定位
   */
  private locate(): Observable<any> {
    return new Observable((sub: any) => {
      this.mapService.displayCurrentPosition().subscribe(data => {
        console.log("displayCurrentPosition success");
        this.loader.dismiss();
        this.localized = true;
        // Vibrate the device for a second
        // Vibration.vibrate(1000);
        this.locationLat = data.position.getLat();
        this.locationLng = data.position.getLng();
        sub.next(data);
        sub.complete();
      }, error => {
        sub.error(error);
        this.loader.dismiss();
        this.alertNoGps();
      });
    });
  }

  /**
   * 出错提示
   */
  private alertNoGps() {
    const alert = this.alertCtrl.create({
      title: 'OFBH5',
      subTitle: '定位服务不可用,请到设置里面开启!',
      enableBackdropDismiss: false,
      buttons: [{
        text: '好的',
        handler: () => {
        }
      }]
    });
    alert.present();
  }

  private loadParkingLocation_CallBacks(data,parkingLotName,accountingStandard,berthNo,parkingLotProperty,ServiceTime) {
        
        //map.setFitView();
        //document.getElementById("result").innerHTML = resultStr;
    }


  /**
   * 添加Marker
   */
  initMarker() {
    console.log("start get markers");
    AMap.plugin('AMap.Geocoder', function () {
      var geocoder = new AMap.Geocoder({
            city: "上海", //城市，默认：“全国”
            radius: 1000 //范围，默认：500
        });
    var parkingLotLocation;
    var parkingLotName;
    var accountingStandards;
    var berthNo;
    var parkingLotProperty;
    var ServiceTime;
    //console.log(this.mapService.getMarkers());
    
    this.mapService.getMarkers().subscribe((json: any) => {
        for (var i=0 ; i<eval(json).length ; i++){
        		parkingLotLocation = eval(json)[i].location;
        		parkingLotName = eval(json)[i].parkingLotName;
        		accountingStandards = eval(json)[i].accountingStandards;
        		berthNo = eval(json)[i].berthNo;
        		parkingLotProperty = eval(json)[i].parkingLotProperty;
        		ServiceTime = eval(json)[i].serviceTime;
        		console.log(parkingLotLocation);
        		geocoder.getLocation(parkingLotLocation,function(status, result){
        		if (status === 'complete' && result.info === 'OK') {
                    // this.loadParkingLocation_CallBacks(result, parkingLotName,accountingStandards.toString(),
                    // berthNo.toString(),parkingLotProperty,ServiceTime);
                    var resultStr = "";
                    //地理编码结果数组
                    var geocode = result.geocodes;
                    for (var i = 0; i < geocode.length; i++) {
                      var marker = new AMap.Marker({
                          iconLabel: '1',
                          map: this.map,
                          position: [ geocode[i].location.getLng(),  geocode[i].location.getLat()]
                      });

                      var infoWindow = new AMap.InfoWindow({
                      content: geocode[i].formattedAddress,
                      offset: {x: 0, y: -30}
                      });
                      marker.on("mouseover", function(e) {
                      infoWindow.open(this.map, marker.getPosition());
                      });
                      AMap.event.addListener(marker,'click',function(e){
                      //document.getElementById("markerinfo").style.display="block";
                      // alert('两点间距离为：' + lnglat.distance([116.387271, 39.922501]) + '米');
                      console.log(parkingLotName);
            
                      var lnglat = new AMap.LngLat(this.locationLng, this.locationLat);
                      var distances = (lnglat.distance([geocode[i].location.getLng(),geocode[i].location.getLat()])/1000).toFixed(2);
                      var divStr = '<div class="mui-content"><div class="row"><div class="col col-50">停车场名：'+ parkingLotName + '</div><div class="col col-50">距离目的地:'+distances.toString()+'公里</div>';
                      divStr += '<div class="col col-100"><button class="button button-positive">'+parkingLotProperty +'</button>&nbsp;&nbsp;' +
                        '<button class="button button-positive">'+ ServiceTime +'</div>';
                      divStr += '<div class="col col-50">空闲车位数：'+ berthNo +' |收费标准：'+accountingStandards +'元/小时</div><div class="col col-50">' +
                      ' <a href="androidamap://navi?sourceApplication=appname&amp;poiname=fangheng&amp;lat=36.547901&amp;lon=104.258354&amp;dev=1&amp;style=2" class="mui-btn mui-btn-primary"><i class="mui-icon mui-icon-paperplane"></i>导航</a></div>';
                      divStr += '</div></div>';
                      //<a href="androidamap://navi?sourceApplication=appname&amp;poiname=fangheng&amp;lat=36.547901&amp;lon=104.258354&amp;dev=1&amp;style=2">导航</a>
                      document.getElementById("markerinfo").innerHTML = divStr;
                      document.getElementById("markerinfo").style.display="block";
            //获取地址信息
            //openInfo(marker.getExtData());

                       });
                     }
        	        }
        	    });
        	}
    
        });
    });    
          //return parkingLotInfos;
  }
  
  addMarkers(i, d,parkingLotName,accountingStandard,berthNo,parkingLotProperty,ServiceTime) {
        var marker = new AMap.Marker({
            iconLabel: '1',
            map: this.map,
            position: [ d.location.getLng(),  d.location.getLat()]
        });

        var infoWindow = new AMap.InfoWindow({
            content: d.formattedAddress,
            offset: {x: 0, y: -30}
        });
        marker.on("mouseover", function(e) {
            infoWindow.open(this.map, marker.getPosition());
        });
        AMap.event.addListener(marker,'click',function(e){
            //document.getElementById("markerinfo").style.display="block";
            // alert('两点间距离为：' + lnglat.distance([116.387271, 39.922501]) + '米');
            console.log(parkingLotName);
            
            var lnglat = new AMap.LngLat(this.locationLng, this.locationLat);
            var distances = (lnglat.distance([d.location.getLng(),d.location.getLat()])/1000).toFixed(2);
            var divStr = '<div class="mui-content"><div class="row"><div class="col col-50">停车场名：'+ parkingLotName + '</div><div class="col col-50">距离目的地:'+distances.toString()+'公里</div>';
            divStr += '<div class="col col-100"><button class="button button-positive">'+parkingLotProperty +'</button>&nbsp;&nbsp;' +
                        '<button class="button button-positive">'+ ServiceTime +'</div>';
            divStr += '<div class="col col-50">空闲车位数：'+ berthNo +' |收费标准：'+accountingStandard +'元/小时</div><div class="col col-50">' +
                      ' <a href="androidamap://navi?sourceApplication=appname&amp;poiname=fangheng&amp;lat=36.547901&amp;lon=104.258354&amp;dev=1&amp;style=2" class="mui-btn mui-btn-primary"><i class="mui-icon mui-icon-paperplane"></i>导航</a></div>';
            divStr += '</div></div>';
            //<a href="androidamap://navi?sourceApplication=appname&amp;poiname=fangheng&amp;lat=36.547901&amp;lon=104.258354&amp;dev=1&amp;style=2">导航</a>
            document.getElementById("markerinfo").innerHTML = divStr;
            document.getElementById("markerinfo").style.display="block";
            //获取地址信息
            //openInfo(marker.getExtData());

        });
    }
  
  /**
   * 跳转至附近控制器
   */
  goToNearbyCtrl() {
    this.navCtrl.push(NearbyCtrl);
  }

  alipay() {
    var payInfo = "test 支付宝";
    // Cordova.plugins.AliPay.pay(payInfo,function success(e){},function error(e){});
  }
  autoComplete(event) {
    if (event.target.value.length == 0) {

      this.places = [];
    } else {
      this.mapService.autoComplete(event.target.value).subscribe((result) => {
        console.log("autoComplete callback success!");
        console.log("resule");
        console.log(result);
        if ("no_data" == result) {
          this.displayMessageToast("未找到相关结果,请重新输入!");
        } else {
          this.places = result;
        }
      }, (error) => {
        this.displayMessageToast("网络不给力,请稍后重试!");
        console.error(error);
      });
    }
  }

  /***
   * Place item has been selected
   */
  searchPlace(place: any) {
    this.displayLoading();
    this.mapService.searchPlace(place).subscribe((result) => {
      this.loading.dismiss();
      console.log("searchPlace callback success!");
      if ("no_data" == result) {
        this.displayMessageToast();
      } else {
        this.dismiss();
      }
    }, (error) => {
      this.loading.dismiss();
      this.displayMessageToast("网络不给力,请稍后重试!");
      console.error(error);
    });
  }

  searchType(type: string, radius: number = 3000) {
    this.displayLoading();
    this.mapService.searchNearby(type, radius).subscribe((result) => {
      this.loading.dismiss();
      console.log("searchNearby callback success!");
      if ("no_data" == result) {
        this.displayMessageToast();
      } else {
        this.navCtrl.pop();
      }
    }, (error) => {
      this.loading.dismiss();
      this.displayMessageToast("网络不给力,请稍后重试!");
      console.error(error);
    });
  }

  dismiss() {
    this.navCtrl.pop();
  }
}
