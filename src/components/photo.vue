<template>
	<div class="zmiti-photo-main-ui lt-full" :class="{'show':showPhoto}">
		<canvas ref='bg-canvas' class="zmiti-bg-canvas" :width='viewW' :height='viewH'></canvas>
		<div class="zmiti-title">
			<img src="../assets/title.png">
		</div>

		<div class="zmiti-line1"></div>
		<div class="zmiti-line2"></div>
		<div class="zmiti-photo-C " :class='{"active":photoAnimate && !detectionError,"error":detectionError,"restore":restore}'>
			<img src='../assets/corner.png' />
			<img src='../assets/corner.png' />
			<img src='../assets/corner.png' />
			<img src='../assets/corner.png' />

			<span v-if='detectionError' :class="{'animate':detectionError}" class="zmiti-detection-error" v-html='detectionError'></span>
			
			<div class="zmiti-photo-grid-C"  :class='{"active":showGrid}'  v-if='!detectionError'>
				<ul :class="{'show':clipImg && !validate}">
					<li v-for='li in lis' :class='{"active":currentIndex === li,"scan":(li<10 || (li+1)%10===0)}'>
						<span v-if='clipImg' :style='{WebkitAnimationDuration:(Math.random()*3+2)+"s",opacity:li%3/3}'></span>
					</li>
				</ul>

				<div v-if='clipImg' class="zmiti-cliped-img">
					<img :src='clipImg' />
				</div>

				<div  class="zmiti-upload-img" :class="{'animate':!clipImg}">
					<img src="../assets/upload.png">
				</div>
				<input class="zmiti-file" accept="image/*" type='file' ref='file' @change="upload"/>

				<div class="zmiti-scaning" v-if='scaning'>扫描中...</div>
			</div>

			<div class="zmiti-result-value" v-if='attractive>0 || smile>0'>
				<div>
					<span> 颜值</span>
					<span class="zmiti-val" >【<em v-html='attractive'></em>】</span>
				</div>
				<div>
					<span> 开心度</span>
					<span class="zmiti-val" >【<em v-html='smile'></em>】</span>
				</div>
			</div>

		</div>
		<div class="zmiti-face-btns" v-if='false'>
			<div @touchstart='rePhoto=true' @touchend='rePhoto=false' :class='{"active":rePhoto}' @click='reupload'>重新上传</div>
			<div @touchstart='sure=true' @click='entryResult' @touchend='sure=false' :class='{"active":sure}'>完成</div>
		</div>
		<div v-show='headimg' class="zmiti-img-clip-C lt-full">
			<header>
				<div @click="cancelClip">取消</div>
				<div @click="beginFacedetection">确定</div>
			</header>
			<div class="zmiti-clip-img">
				<canvas ref='canvas' :width='viewW' :height='viewH - 1.5*viewW/10'></canvas>
				<canvas @touchstart='touchstart($event)' @touchmove='touchmove($event)' @touchend="touchend($event)" :style='{WebkitTransform:"translate3d("+transX+"px,"+transY+"px,0)"}' class="zmiti-clip-canvas" ref='clip-canvas' :width='clipSize' :height='clipSize*14/10'></canvas>

				<div ref='scan' class="zmiti-scan" :style="{WebkitTransform:'translate3d('+(clipSize+transX+offsetLeft/2-20)+'px,'+(clipSize*14/10-20+transY)+'px,0)'}">
					<img src="../assets/scan.png">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
 import './css/photo.css';

 import $ from 'jquery';

 //import './sketching.js';

 import ZmitiSnow from './snow';


	export default {
		props:['obserable','showPhoto'],
		data(){
			return {

				scaning:false,
				photoAnimate:false,
				lis:[],
				clipSize:0,
				currentIndex:-1,
				transX:0,
				validate:false,//默认没有验证成功
				transY:0,
				detectionError:'',//识别错误
				rePhoto:false,
				sure:false,
				offsetLeft:0,
				offsetTop:0,
				restore:false,
				smile:0,
				attractive:0,
				imgType:1,//1 竖图 2 横图
				showGrid:false,
				clipImg:'',//'http://api.zmiti.com/zmiti_ele/public/ca0953e33de72059dee5e045d9379e5b.png',
				headimg:'',//'http://api.zmiti.com/zmiti_ele/other/20171227/1e2e43d750537bc4800e00ce43e19e4e.png',//
				viewW:document.documentElement.clientWidth,
				viewH:document.documentElement.clientHeight
			}
		},
		methods:{

			entryResult(){//确定并进入结果页面

				var {obserable} = this;
				

				if(this.validate){
					var avg = (this.smile+this.attractive)/2;
				
		            /*var ctx = this.clipContext;
		            var imgData = ctx.getImageData(0, 0, this.clipSize,this.clipSize);
		                sk.sketch(imgData, 8);
		                ctx.putImageData(imgData, 0, 0);*/

		                var img = new Image();
		                img.onload = ()=>{
							this.$emit('show-result-page',this.clipImg)
							obserable.trigger({
								type:'badgeUp',
								data:avg
							})
		                }
		                img.src=this.clipImg;
					var URI = window.location.href.split('#')[0];
						URI = this.changeURLPar(URI, 'src', this.clipImg);

					this.wxConfig('我的新年满意度是【'+avg+'】，击败了55%的网友','我可能过了一个假的新年，你呢？',URI);
					
				}

			},
			reupload(){
				this.headimg = '';
				this.clipImg = '';
			},
			cancelClip(){

				this.headimg='';
				this.smile = 0;
				this.attractive = 0;
				this.$emit('play-show',true);
			},
			upload(){
				this.detectionError = '正在上传，请稍后';

				
				var formData = new FormData();
	  		      var s = this;
	  
			      formData.append('setupfile', this.$refs['file'].files[0]);
			      formData.append('uploadtype', 0);
			      $.ajax({
			        type: "POST",
			        contentType: false,
			        processData: false,
			        url: 'http://api.zmiti.com/v2/share/upload_file/',
			        data: formData
			      }).done((data) => {
			        console.log(data)
			        if (data.getret === 0) {
			          var url = data.getfileurl[0].datainfourl;
			          var img = new Image();
			          img.onload =()=>{
			          	this.headimg = url;

			          	this.$emit('play-show',false);//隐藏音乐播放按钮
			          	this.initCanvas();

			          	this.detectionError = '';
			          }
			          img.src = url
			        }
			      });
			},
			 request(url,t){


			 	
			      $.ajax({
			        url:'http://api.zmiti.com/v2/share/facedetection',
			        data:{
			          api_id:'ca9cad1836874571a2ad243b36f0b633',
			          api_secret:'54853f8e921d4590bb339ea7c0ecaf07',
			          attributes:1,
			          url
			        },
			        type:'post',


			      }).done(data=>{
			        console.log(data);
			        if(data.getret ===0 ){
			        	clearInterval(t);
			        	this.currentIndex = -1;
			        	if(! data.apiresult.faces[0]){
			        		//alert('未检测到人脸')
			        		this.detectionError = '无法识别，请重试';
			        		this.photoAnimate = false;
							this.showGrid = false;
							this.restore = true;
			        		setTimeout(()=>{
			        			this.detectionError = '';
		        				this.photoAnimate = true;
								this.showGrid = true;
								//this.restore = false;
								this.headimg = '';
								this.clipImg = '';


			        		},2000)
			        		return;
			        	}
			        	this.scaning = false;
			        	var result = data.apiresult.faces[0].attributes;
			        	this.smile = result.smile;
			        	this.attractive = result.attractive;
						this.validate = true;


						setTimeout(()=>{
							this.entryResult();
						},2000)
			        	
			        	
			        	
			        }
			      })
			 },
			beginFacedetection(){
				//开始人脸验证
				this.$emit('play-show',true);
				this.headimg = '';
				this.scaning = true;
				 $.ajax({
                   url: 'http://api.zmiti.com/v2/share/base64_image/',
	                   type: 'post',
	                   data: {
	                       setcontents: this.clipContext.canvas.toDataURL(),
	                       setwidth: this.clipSize|0,
	                       setheight: this.clipSize*14/10|0
	                   }
	               }).done(data=>{
	               	   if (data.getret === 0) {
	                       var src = data.getimageurl;
	                       this.clipImg = src;
	                        var t = setInterval(()=>{
						 	 	var index = Math.random()*100|0;
						 	 	this.currentIndex = index;
						 	 },300)
	                       setTimeout(()=>{
	                       	 this.request(src,t);
	                       },1000)
	                    }
	               })
			},
			initCanvas(){
				var canvas = this.$refs['canvas'];
				var context = canvas.getContext('2d');
				var canvasW = canvas.width,
					canvasH = canvas.height,
					canvasScale = canvasW / canvasH;

				var img = new Image();

				var self = this;
				img.crossOrigin = '*'

				img.onload = function(){

					var scale = this.width/this.height;


					
					if(this.height / this.width <= canvasH / canvasW){//横图，

						var y = (canvasH - this.height*canvasW/this.width);
						context.drawImage(this,0,y/2,canvasW,this.height*canvasW/this.width);
						self.transX = 0;
						self.clipSize = Math.min(this.height*canvasW/this.width | 0,canvasW)/1.5;
						self.transY = y/2;
						self.imgType = 0;
						self.offsetTop = y/2;
					}
					else{


						scale = canvasH*this.width/this.height;

						var x = canvasW- scale;
						self.offsetLeft = x/2;

						context.drawImage(this,self.offsetLeft,0,scale,canvasH);
						self.transX = x/2;
						self.transY = 0;
						self.clipSize = scale |0;;
						self.imgType = 1;
					}
					self.context = context;
					var clipCanvas = self.$refs['clip-canvas'];
					var clipContext = clipCanvas.getContext('2d');

					var clipCanvasH = self.clipSize * 14 /10;



					setTimeout(()=>{
						clipContext.drawImage(canvas,self.transX,self.transY,self.clipSize,self.clipSize*14/10,0,0,self.clipSize,clipCanvasH)
					},10)

					self.clipContext = clipContext;
					self.canvas = canvas;
				
					
				}

				img.src= this.headimg;

			},
			touchstart(e){
				this.isCanMove = true;
				this.startX = e.changedTouches[0].pageX - this.transX;
				this.startY = e.changedTouches[0].pageY -this.transY;
			},
			touchmove(e){
				var self = this;
				var canvas = self.canvas;
				var endX = e.changedTouches[0].pageX;
				var endY = e.changedTouches[0].pageY;


				//this.clipContext.clearRect(0,0,self.clipSize,self.clipSize);

				if(self.imgType === 1){
					this.transY = endY - this.startY;
					if(self.transY<=0){
						self.transY = 0;
						return;
					}
					if(self.transY >= canvas.height-self.clipSize){
						self.transY = canvas.height-self.clipSize;
						return;
					}

					this.transX = endX - this.startX;
					if(self.transX<self.offsetLeft){
						self.transX = self.offsetLeft;
					}

					if(self.transX>canvas.width-self.clipSize - self.offsetLeft){
						self.transX = canvas.width-self.clipSize - self.offsetLeft;
						
					}
					//this.clipContext.clearRect(0,0,self.clipSize,self.clipSize);
					this.clipContext.drawImage(canvas,self.transX,self.transY,self.clipSize,self.clipSize*14/10,0,0,self.clipSize,self.clipSize*14/10)
				}
				else{
					this.transX = endX - this.startX;
					if(this.transX<=0){
						this.transX = 0;
						return;
					}

					if(this.transX>canvas.width - self.clipSize){
						this.transX = canvas.width - self.clipSize;
						return;
					}

					this.transY = endY - this.startY;
					if(self.transY<=0){
						self.transY = 0;
						return;
					}
					if(self.transY >= canvas.height-self.clipSize){
						self.transY = canvas.height-self.clipSize;
						return;
					}

					this.clipContext.clearRect(0,0,self.clipSize,self.clipSize);
					this.clipContext.drawImage(canvas,self.transX,self.transY,self.clipSize,self.clipSize*14/10,0,0,self.clipSize,self.clipSize*14/10)
				}


			},
			bindEvent(){

				var self = this;
				var canvas = this.$refs['canvas'];
				var $doc=$(document);
				$(this.$refs['scan']).on('touchstart',e=>{
					var startX = e.changedTouches[0].pageX;
					var startY = e.changedTouches[0].pageY;

					var defaultSize = this.clipSize;
					$doc.on('touchmove',e=>{

						var endX = e.changedTouches[0].pageX;
						var endY = e.changedTouches[0].pageY;

						this.clipSize = defaultSize -((startX - endX));
						

					}).on('touchend',e=>{
						$doc.off('touchend touchmove')
						this.clipContext.drawImage(canvas,self.transX,self.transY,self.clipSize,self.clipSize*14/10,0,0,self.clipSize,self.clipSize*14/10)
					})
				})
			},
			touchend(){
				this.isCanMove = false;
			},
			initSnow(){
				var snowArr = [];
				var canvas = this.$refs['bg-canvas'];
				var bgContext = canvas.getContext('2d');
	  	  		var t = setInterval(()=>{
	  	  			if(snowArr.length>=150){
	  	  				clearInterval(t);
	  	  			}
	  	  			snowArr.push(new ZmitiSnow({
	  			  		x:Math.random()*this.viewW,
	  	          		y:-Math.random()*200+50,
	  			  		cxt:bgContext
	  			  	}));
	  	  		},60)

	  	  		var self = this;

	  	  		var animation = requestAnimationFrame || webkitRequestAnimationFrame;
	  	  		var rem = this.viewW /10;
	  	  		
	  	  		var dieSnowArr = [];
	  	  		function render(){
	  	  			var offsetTop1 = self.viewH -  2 *rem - rem*Math.random();
	    		    bgContext.clearRect(0, 0, self.viewW, self.viewH)

	    			 snowArr.forEach(snow=>{
		  				snow.alive && snow.fly()
		  				if(snow.y>offsetTop1 && false){
		  					snow.speedY = 0;
		  					//snow.y = offsetTop1; 
		  					snow.speedX = 0;
		  					snow.alive = false;

		  					//dieSnowArr.push(1);
		  				//dieSnowArr.length > 200 &&snowArr.shift()

		  					

		  					
		  			
		  				}

		  				/*if(!snow.alive){
		  					snow.alive = true;
		  					  snowArr.length<=400&&snowArr.push(new ZmitiSnow({
		  		                    x:Math.random()*self.viewW,
		  		                    y:-Math.random()*200+50,
		  		                    cxt:bgContext
		  		              }));
		  				}*/
	    			 });


	    			 
	    			animation(render)	
	    		
	    			 
	    		   
	    		}

    			render();
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
				    } 
		},
		mounted(){

			this.initSnow();
			//this.headimg ='http://api.zmiti.com/zmiti_ele/other/20171227/b93360e8cd81dfb938b9025696efdd76.png';


			var {obserable} = this;

			obserable.on('restart',()=>{
				this.clipImg = '';
				this.headimg = '';
				this.attractive = 0;
				this.smile = 0;
			})

			this.bindEvent();
			for(var i = 0; i<10*14;i++){
				this.lis.push(i);
			}
			setTimeout(()=>{
				this.photoAnimate = true;
				this.showGrid = true;

			},1000)

			
			!this.validate && this.initCanvas();

		}
	}
</script>

<style scoped>
	.zmiti-photo-main-ui{
		background: url(../assets/face-bg.jpg) no-repeat center bottom;
		background-size: cover;
	}
 	.zmiti-face-btns>div {
	background: url(../assets/btn-b.png) center center;
	}

</style>