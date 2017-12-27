<template>
  <div>
    <Result :showResult='false'></Result>
    <Photo></Photo>
  </div>

</template>

<script>
import $ from 'jquery';
import Result from './result';
import Photo from './photo';
import './css/index.css';
export default {
  name: 'HelloWorld',
  data () {
    return {
      
    }
  },
  components:{
    Result,
    Photo
  },
  methods:{
    wxConfig: function(title, desc,  url) {
      
    var s = this;
    var img = 'http://h5.zmiti.com/public/newcard/300.jpg';
    var appId = 'wxfacf4a639d9e3bcc'; //'wxfacf4a639d9e3bcc'; // data.wxappid; // 'wxfacf4a639d9e3bcc'; //data.wxappid;

    var durl = url || location.href.split('#')[0];
    var code_durl = encodeURIComponent(durl);

    $.ajax({
      type: 'get',
      url: "http://api.zmiti.com/weixin/jssdk.php?type=signature&durl=" + code_durl,
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

  getOauthurl: function() {
    var s = this;
    var data = {
      wxappid: 'wxfacf4a639d9e3bcc',
      wxappsecret: "149cdef95c99ff7cab523d8beca86080"
    }
    $.ajax({
      type: 'post',
      url: 'http://api.zmiti.com/v2/weixin/getwxuserinfo/',
      data: {
        code: s.getQueryString('code'),
        wxappid: data.wxappid,
        wxappsecret: data.wxappsecret
      },
      error: function() {},
      success: function(dt) {

        if (dt.getret === 0) {


          s.openid = dt.userinfo.openid;
          s.nickname = dt.userinfo.nickname;
          s.headimgurl = dt.userinfo.headimgurl;

          window.nickname = s.nickname;
          window.headimgurl = s.headimgurl;

          var opt = {
            nickname: s.nickname,
            headimgurl: s.headimgurl
          }

         s.wxConfig('收到'+s.nickname+'为你制作的新年贺卡','快打开看看吧');
          
        } else {
          if (s.isWeiXin()) {
            var nickname = s.getQueryString('nickname');
            var src = s.getQueryString('src');
            var serverId = s.getQueryString('serverId');

            var redirect_uri = window.location.href.split('?')[0];

            if (nickname) {
              redirect_uri = s.changeURLPar(redirect_uri, 'nickname', (nickname));
            }
            if(src){
              redirect_uri = s.changeURLPar(redirect_uri, 'src', (src));  
            }
            if(serverId){
             redirect_uri = s.changeURLPar(redirect_uri, 'serverId', (serverId));   
            }

            $.ajax({
              url: 'http://api.zmiti.com/v2/weixin/getoauthurl/',
              type: 'post',
              data: {
                redirect_uri: redirect_uri,
                scope: 'snsapi_userinfo',
                worksid: 31,
                state: new Date().getTime() + ''
              },
              error: function() {},
              success: function(dt) {
                if (dt.getret === 0) {

                  window.location.href = dt.url;

                }
              }
            })
          } else {}

        }


      }
    });
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
   
  },
  mounted(){

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
