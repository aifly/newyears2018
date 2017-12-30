<template>
  <div>
    <Result @play-show='togglePlay' @restart='restart' :obserable='obserable' :clipImg='clipImg' :avg='avg' :showResult='showResult'></Result>
    <Photo :showPhoto='showPhoto' @play-show='togglePlay' :obserable='obserable' @show-result-page='showResultPage'></Photo>
    <audio autoplay="autoplay" src='../assets/bg.mp3' ref='bg-music'  loop="loop"></audio>

    <div v-show='showPlay' @click='toggleMusic' class="zmiti-play" :class='{"play":bgState}'>
      <img src="../assets/bg-ico2.png">
    </div>

    <div class="zmiti-loading-main-ui lt-full">
       <img :class='{"hide":progress>=100}' src='../assets/cloud.png' class="zmiti-cloud" />
       <img :class='{"hide":progress>=100}' src='../assets/cloud.png' class="zmiti-cloud zmiti-cloud1" />
        <div :class='{"hide":progress>=100}' class="zmiti-loading-bar">
           <img src='../assets/cloud.png' :style="{WebkitTransform:'translate('+progress/100*5+'rem,0)'}" />
           <div>
             <span :style='{WebkitTransform:"scale("+progress/100+",1)"}'></span>
           </div>
           <div v-html='progress+"%"' class="zmiti-progress"></div>
        </div>
    </div>
  </div>

</template>

<script>
import $ from 'jquery';
import Result from './result';
import Photo from './photo';
import './css/index.css';
import Obserable from './obserable';
var obserable = new Obserable();
export default {
  name: 'HelloWorld',
  data () {
    return {
      showResult:false,
      avg:0,

      showPhoto:false,

      progress:0,

      showPlay:true,

      obserable,
      bgState:false,
      clipImg:'',
      loadingImg:[

      ]
    }
  },
  components:{
    Result,
    Photo
  },
  methods:{

    loading(arr, fn, fnEnd) {
    var len = arr.length;
    var count = 0;
    var i = 0;

    function loadimg() {
      if (i === len) {
        return;
      }
      var img = new Image();
      img.onload = img.onerror = function() {
        count++;
        if (i < len - 1) {
          i++;
          loadimg();
          fn && fn(i / (len - 1), img.src);
        } else {
          fnEnd && fnEnd(img.src);
        }
      };
      img.src = arr[i];
    }
    loadimg();
  },
    togglePlay(data){
      this.showPlay = data;
    },
    toggleMusic(){
      var audio = this.$refs['bg-music'];
      audio[audio.paused?'play':'pause']()
    },
    restart(){
      this.showResult = false;
      this.clipImg = '';

      obserable.trigger({
        type:'restart'
      });


    },

    showResultPage(clipImg){


      this.clipImg = clipImg;
      
      this.showResult = true;

    },
    wxConfig: function(title, desc,  url) {
      
      var s = this;
      var img = 'http://h5.zhongguowangshi.com/newyears2018/300.jpg';
      var appId = 'wx5ec3d35069383211'; //'wxfacf4a639d9e3bcc'; // data.wxappid; // 'wxfacf4a639d9e3bcc'; //data.wxappid;

      var durl = url || location.href.split('#')[0];
      var code_durl = encodeURIComponent(durl);

      $.ajax({
        type: 'get',
        //url: "http://api.zmiti.com/weixin/jssdk.php?type=signature&durl=" + code_durl,
        url: "http://h5.zhongguowangshi.com/newyears2018/weixin/jssdk.php?type=signature&durl=" + code_durl+'&worksid=5273807230',
        dataType: 'jsonp',
        jsonp: "callback",
        jsonpCallback: "jsonFlickrFeed",
        error: function() {

        },
        success: function(data) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appId, // 必填，公众号的唯一标识
            timestamp: '1488558145', // 必填，生成签名的时间戳
            nonceStr: 'Wm3WZYTPz0wzccnW', // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: ['checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'startRecord',
                'stopRecord',
                'onRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
              ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });

          wx.ready(function() {

            //朋友圈

            wx.onMenuShareTimeline({
              title: title, // 分享标题
              link: durl, // 分享链接
              imgUrl: img, // 分享图标
              desc: desc,
              success: function() {},
              cancel: function() {}
            });
            //朋友
            wx.onMenuShareAppMessage({
              title: title, // 分享标题
              link: durl,
              imgUrl: img, // 分享图标
              type: "link",
              dataUrl: "",
              desc: desc,
              success: function() {},
              cancel: function() {}
            });
            //qq
            wx.onMenuShareQQ({
              title: title, // 分享标题
              link: durl, // 分享链接
              imgUrl: img, // 分享图标
              desc: desc,
              success: function() {},
              cancel: function() {}
            });
          });
        }
      });

   },
  getQueryString: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]);
    return null;
  },
    changeURLPar: function(url, arg, val) {
      var pattern = arg + '=([^&]*)';
      var replaceText = arg + '=' + val;
      return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
    },
    isWeiXin: function() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
      } else {
        return false;
      }
    },

  updatePv(){
    $.ajax({
      url:'http://api.zmiti.com/v2/custom/update_pvnum/customid/32',
      type:'post',
      data:{
        customid:32
      }
    });
  }
   
  },

  mounted(){

    obserable.on('toggleMusic',()=>{
      this.toggleMusic();
    })

    this.updatePv();
    var self = this;
    $(self.$refs['bg-music']).on('play',()=>{
      this.bgState = true;
    }).on('pause',()=>{
      this.bgState = false;
    })

    setTimeout(()=>{
      
    },1000)
    self.$refs['bg-music'].play();

    //
    document.addEventListener("WeixinJSBridgeReady", function() {
         WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
             self.$refs['bg-music'].play();
         });
     }, false);

    this.wxConfig(document.title,'听说微笑可以增加颜值，你准备好了吗');


    var imgs = [];
      $('img').each(function(){
        imgs.push($(this).attr('src'))
      });

      $('.lt-full').each(function(){
          
          var url = $(this).css('backgroundImage');

          var str=url;
          var reg=/\"(.*)\"/g;
          var arr=str.match(reg);
          if(arr){
            imgs.push(arr[0].replace(/"/ig,''));
          }
        })
        var s = this;
          this.loading(imgs,function(e){
              s.progress = (e*100|0);
          },function(){
            s.showPhoto = true;
          })

      var src = this.getQueryString('src');
      var avg = this.getQueryString('avg');

      if(src&& avg){
        this.showResult = true;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .zmiti-loading-main-ui{
     background: url(../assets/bg1.jpg) no-repeat center;
     z-index: -1;
  }


</style>
