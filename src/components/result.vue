<template>
	<div v-if='showResult'  :class='{"show":showMain}' ref='zmiti-scene' class="zmiti-reuslt-main-ui  lt-full">
		<audio src='../assets/photo.mp3' ref='photo-audio'></audio>
		<div class="zmiti-card " ref='zmiti-card' :class="{'active':shareAvg>-1 || clipResultImg}" >
			<img :src='clipResultImg || shareSrc' v-if='clipResultImg ||shareSrc'/>
			<div v-if='!clipResultImg && !shareSrc'>
				<img src="../assets/card.png">
				<canvas ref='canvas' class="zmiti-canvas" :width='viewW*.7' :height="viewW*.8"></canvas>
				<div class="zmiti-reuslt-main" :class='{"active":showMain,"hideline":hideLine,"lantern-up":lanternUp}'>
					
					<div class="zmiti-headimg">
						<div>
							<img :src='clipImg'>
						</div>

						<img src="../assets/shadow.png" class="zmiti-shadow">
						
					</div>

					<div class="zmiti-result-level">
						<div class="zmiti-badge">
								<img src='../assets/badge.png'/>
								<span v-html='"【"+((avg||shareAvg)|0)+"】"'></span>
							</div>

						<div class="zmiti-result-img" >
							<img v-if='i === srcIndex' :src='"../assets/"+i+".gif"' v-for="i in [0,1,2,3,4,5,6,7,8,9,10,11]" />
						</div>
					</div>

					<div class="zmiti-lantern">
						<img src="../assets/lantern.png" ref='lantern' >
					</div>

					<div class="zmiti-lantern1">
						<img src="../assets/lantern.png" ref='lantern' >
					</div>
				</div>


				<div class="zmiti-star">
					<img src="../assets/star.png">
				</div>

				

				<!-- <div class="zmiti-sentime-logo">
					<img src="../assets/sentime-logo.png"  />
					人脸识别技术由商汤科技提供支持
				</div> -->
			</div>
		</div>

		<div class="zmiti-card zmiti-card1 " ref='zmiti-card1' v-if='!shareSrc && clipNotDone' >
			<div>
				<img src="../assets/card.png">
				<canvas ref='canvas' class="zmiti-canvas" :width='viewW*.7' :height="viewW*.8"></canvas>
				<div class="zmiti-reuslt-main" :class='{"active":showMain,"hideline":hideLine,"lantern-up":lanternUp}'>
					
					<div class="zmiti-headimg">
						<div>
							<img :src='clipImg'>
						</div>
						<img src="../assets/shadow.png" class="zmiti-shadow">
						
					</div>

					<div class="zmiti-result-level">
						<div class="zmiti-badge">
								<img src='../assets/badge.png'/>
								<span v-html='"【"+((avg||shareAvg)|0)+"】"'></span>
							</div>

						<div class="zmiti-result-img" >
							<img v-if='i === srcIndex' :src='"../assets/"+i+".gif"' v-for="i in [0,1,2,3,4,5,6,7,8,9,10,11]" />
						</div>
					</div>

					<div class="zmiti-lantern">
						<img src="../assets/lantern.png" ref='lantern' >
					</div>

					<div class="zmiti-lantern1">
						<img src="../assets/lantern.png" ref='lantern' >
					</div>
				</div>


				<div class="zmiti-star">
					<img src="../assets/star.png">
				</div>

				

				<!-- <div class="zmiti-sentime-logo">
					<img src="../assets/sentime-logo.png"  />
					人脸识别技术由商汤科技提供支持
				</div> -->
			</div>
		</div>


		<div v-if='clipResultImg' class="zmiti-result-btns">
			<div @touchstart='rePhoto=true' @click="restart" @touchend='rePhoto=false' :class='{"active":rePhoto}'>
				<img src='../assets/btn1.png'/>
				再刷一次
			</div>
			<div @touchstart='sendToFriend=true' @touchend='sendToFriend=false' :class='{"active":sendToFriend}' @click='showMaskHandler'>
				<img src='../assets/btn2.png'/>
			呼唤小伙伴前来围观
			</div>
		</div>

		<div @touchstart='rePhoto=true' class="zmiti-reload" @click="reload" @touchend='rePhoto=false' v-if='shareSrc' :class='{"active":rePhoto}'>
			<img src='../assets/btn1.png'/>
			我也来“刷脸”
		</div>

		<div v-if='clipResultImg || shareSrc' class="zmiti-result-copyright">
			
			<div class="zmiti-logo">
				<img src="../assets/xinhua-logo.png"  />
				新华社新媒体中心、新疆分社联合出品
			</div>

		</div>

		<div v-if='showMask' @touchstart="hideMask" class="zmiti-share-mask lt-full">
			<img src='../assets/info.png'/>
		</div>



<!-- 		<img src='../assets/lantern.png' ref='lantern' class="zmiti-cache-img" />
<img src='../assets/bg.jpg' ref='bg' class="zmiti-cache-img" /> -->
	</div>

</template>
<script>
import $ from 'jquery';
import './css/result.css';
import './html2canvas';
	export default {
		props:['showResult','clipImg','obserable'],
		data(){
			return {
				srcIndex:-1,
				avg:0,
				clipNotDone:true,
				clipResultImg:'',
				showMask:false,
				showMain:true,
				shareSrc:'',
				shareAvg:-1,
				hideLine:true,
				lanternUp:true,
				rePhoto:true,
				sendToFriend:false,
				viewW:document.documentElement.clientWidth,
				viewH:document.documentElement.clientHeight
			}
		},
		methods:{


			reload(){
				location.href = location.href.split('?')[0]
			},
			showMaskHandler(){
				this.showMask = true;
				this.$emit("play-show",false)
			},
			hideMask(){
				this.showMask = false;
				this.$emit('play-show',true)
			},
			restart(){
				this.showMain = this.hideLine = this.lanternUp = false;
				this.avg = 0;
				this.$emit('restart');
				this.clipResultImg = '';
			},

			badgeUp(){
				this.showMain = this.hideLine = this.lanternUp = true;
			},
			wxConfig: function(title, desc,  url) {
      
			      var s = this;
			      var img = 'http://h5.zmiti.com/public/newyears2018/300.jpg';
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


		computed :{
			
		},

		mounted(){
			 
			var {obserable} = this;


			 var src = this.getQueryString('src');
		      var avg = this.getQueryString('avg');

		      if(src&& avg){
		      	 this.shareAvg = avg;
		      	 this.shareSrc = src;


		      	 this.srcIndex = (avg/10|0)+1;

				if(avg === 0){
					this.srcIndex = 0;
				}
		      }



			var iNow = 0;


			var s = this;
			obserable.on('badgeUp',(data)=>{

				setTimeout(()=>{

					var d = data;
					this.avg =d;

					this.srcIndex = (d/10|0)+1;

					if(data === 0){
						this.srcIndex = 0;
					}
					this.badgeUp();

				},500)


				setTimeout(()=>{

							
					var dom = this.$refs['zmiti-card1'];

					var dpi = 2;


					//$(this.$refs['zmiti-scene']).append(cacheDom.css({WebkitTransform:'scale(.8)',opacity:1}));
						
					html2canvas(dom,{
						useCORS: true,
						onrendered: function(canvas) {
					        var url = canvas.toDataURL();
					        $.ajax({
					          url: 'http://api.zmiti.com/v2/share/base64_image/',
					          type: 'post',
					          data: {
					            setcontents: url,
					            setwidth: dom.offsetWidth*dpi|0,
					            setheight: dom.offsetHeight*dpi|0
					          },
					          success: function(data) {
					          	//console.log(data);
					            if (data.getret === 0) {
					              var src = data.getimageurl;
									console.log(src)	
									setTimeout(()=>{
										s.$refs['photo-audio'].play()
										s.clipResultImg = src;

										s.clipNotDone = false;


										var URI = window.location.href.split('#')[0];
											URI = s.changeURLPar(URI, 'src', src);
											URI = s.changeURLPar(URI, 'avg', s.avg);

											var scale = 0;
											if(s.srcIndex >0){
												scale = ((s.srcIndex-1)*10+Math.random()*9)|0;
											}


										s.wxConfig('我的新年满意度是【'+(s.avg|0)+'】，击败了'+(scale)+'%的网友','听说微笑可以增加颜值，你准备好了嘛',URI);
									},3000)
					            }

					          }
					        })


					      },
					      width: dom.offsetWidth*dpi,
					      height: dom.offsetHeight*dpi
					})

				 
				},1000)
			})


			//obserable.trigger({type:'badgeUp',data:88})

		
			
			//this.initWebgl();
		}
	}
</script>
 

 <style scoped>
 	.zmiti-reuslt-main-ui{
 		background: url(../assets/bg.jpg) no-repeat center;
 		background-size: cover;
 		z-index: 305;
 	}

 	.zmiti-result-btns>div {
	

	}

.zmiti-headimg{
	background: url(../assets/shadow.png) no-repeat;
	background-size: contain;
}


 
 </style>