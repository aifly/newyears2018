<template>
	<div class="zmiti-photo-main-ui lt-full">
		<div class="zmiti-photo-C " :class='{"active":photoAnimate && !detectionError,"error":detectionError,"restore":restore}'>
			<img src='../assets/corner.png' />
			<img src='../assets/corner.png' />
			<img src='../assets/corner.png' />
			<img src='../assets/corner.png' />

			<span v-if='detectionError' class="zmiti-detection-error">无法识别，请重试</span>
			
			<div class="zmiti-photo-grid-C"  :class='{"active":showGrid}'  v-if='!detectionError'>
				<ul :class="{'show':clipImg && !validate}">
					<li v-for='li in lis' :class='{"active":currentIndex === li,"scan":(li<10 || (li+1)%10===0)}'>
						<span v-if='clipImg' :style='{WebkitAnimationDuration:(Math.random()*3+2)+"s"}'></span>
					</li>
				</ul>

				<div v-if='clipImg' class="zmiti-cliped-img">
					<img :src='clipImg' />
				</div>

				<div  class="zmiti-upload-img" :class="{'animate':!clipImg}">
					<img src="../assets/upload.png">
				</div>
				<input class="zmiti-file" accept="image/*" type='file' ref='file' @change="upload"/>
			</div>

			<div class="zmiti-result-value" v-if='attractive>0 || smile>0'>
				<div>
					<img src="../assets/happy.png">
					<span> 欢乐度</span>
					<span class="zmiti-value-bar"><em :style='{WebkitTransform:"scale("+attractive/100+",1)"}'></em></span>
					<span class="zmiti-val" v-html='attractive'></span>
				</div>
				<div>
					<img src="../assets/smile.png">
					<span> 微笑度</span>
					<span class="zmiti-value-bar zmiti-value-bar1"><em :style='{WebkitTransform:"scale("+smile/100+",1)"}'></em></span>
					<span class="zmiti-val" v-html='smile'></span>
				</div>
			</div>

		</div>
		<div class="zmiti-face-btns">
			<div @touchstart='rePhoto=true' @touchend='rePhoto=false' :class='{"active":rePhoto}' @click='reupload'>重新上传</div>
			<div @touchstart='sure=true' @click='entryResult' @touchend='sure=false' :class='{"active":sure}'>确定</div>
		</div>
		<div v-show='headimg' class="zmiti-img-clip-C lt-full">
			<header>
				<div @click="cancelClip">取消</div>
				<div @click="beginFacedetection">确定</div>
			</header>
			<div class="zmiti-clip-img">
				<canvas ref='canvas' :width='viewW' :height='viewH - 1.5*viewW/10'></canvas>
				<canvas @touchstart='touchstart($event)' @touchmove='touchmove($event)' @touchend="touchend($event)" :style='{WebkitTransform:"translate3d("+transX+"px,"+transY+"px,0)"}' class="zmiti-clip-canvas" ref='clip-canvas' :width='clipSize' :height='clipSize'></canvas>

				<div ref='scan' class="zmiti-scan" :style="{WebkitTransform:'translate3d('+(clipSize+transX-offsetLeft+20)+'px,'+(clipSize-20+transY)+'px,0)'}">
					<img src="../assets/scan.png">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
 import './css/photo.css';

 import $ from 'jquery';


	export default {
		data(){
			return {
				photoAnimate:false,
				lis:[],
				clipSize:0,
				currentIndex:-1,
				transX:0,
				validate:false,//默认没有验证成功
				transY:0,
				detectionError:false,//识别错误
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

				if(this.validate){
				/*	var img = new Image();
			       img.crossOrigin = '*'
			       img.onload = function(){
			         var alloyImg = AlloyImage(this);
			         //var s = alloyImg.ps('素描').replace(document.getElementById('img'));

			         console.log(alloyImg.ps('素描'));
			        
			       }
			       img.src = this.clipImg;*/
					this.$emit('show-result-page',(this.smile+this.attractive)/2,this.clipImg)
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
			},
			upload(){
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
			          this.headimg = url;
			          this.initCanvas();
			        }
			      });
			},

			 request(url){


			 	 var t = setInterval(()=>{
			 	 	var index = Math.random()*100|0;
			 	 	this.currentIndex = index;
			 	 },300)
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
			        	if(! data.apiresult.faces[0]){
			        		//alert('未检测到人脸')
			        		this.detectionError = true;
			        		this.photoAnimate = false;
							this.showGrid = false;
							this.restore = true;
			        		setTimeout(()=>{
			        			this.detectionError = false;
		        				this.photoAnimate = true;
								this.showGrid = true;
								//this.restore = false;
								this.headimg = '';
								this.clipImg = '';
			        		},2000)
			        		return;
			        	}

			        	clearInterval(t);
			        	var result = data.apiresult.faces[0].attributes;
			        	this.smile = result.smile;
			        	this.attractive = result.attractive;
						this.validate = true;
			        	
			        	
			        	
			        }
			      })
			 },
			beginFacedetection(){
				//开始人脸验证
				this.headimg = '';
				 $.ajax({
                   url: 'http://api.zmiti.com/v2/share/base64_image/',
	                   type: 'post',
	                   data: {
	                       setcontents: this.clipContext.canvas.toDataURL(),
	                       setwidth: this.clipSize|0,
	                       setheight: this.clipSize|0
	                   }
	               }).done(data=>{
	               	   if (data.getret === 0) {
	                       var src = data.getimageurl;
	                       this.clipImg = src;
	                       setTimeout(()=>{
	                       	 this.request(src);
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
						self.clipSize = this.height*canvasW/this.width | 0;
						self.transX = 0;
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
					setTimeout(()=>{
						clipContext.drawImage(canvas,self.transX,self.transY,self.clipSize,self.clipSize,0,0,self.clipSize,self.clipSize)
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
					this.clipContext.drawImage(canvas,self.transX,self.transY,self.clipSize,self.clipSize,0,0,self.clipSize,self.clipSize)
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

					this.clipContext.clearRect(0,0,self.clipSize,self.clipSize);
					this.clipContext.drawImage(canvas,self.transX,self.transY,self.clipSize,self.clipSize,0,0,self.clipSize,self.clipSize)
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
						this.clipContext.drawImage(canvas,self.transX,self.transY,self.clipSize,self.clipSize,0,0,self.clipSize,self.clipSize)
					})
				})
			},
			touchend(){
				this.isCanMove = false;
			}
		},
		mounted(){

			//this.headimg ='http://api.zmiti.com/zmiti_ele/other/20171227/b93360e8cd81dfb938b9025696efdd76.png';



			this.bindEvent();
			for(var i = 0; i<10*10;i++){
				this.lis.push(i);
			}
			setTimeout(()=>{
				this.photoAnimate = true;
				this.showGrid = true;


			},1000)

			 

			//this.initCanvas();

		}
	}
</script>

<style scoped>
	.zmiti-photo-main-ui{
		background: url(../assets/face-bg.jpg) no-repeat center top;
		background-size: cover;
	}
	 	.zmiti-face-btns>div {
		background: url(../assets/btn-b.png) center center;
		}

</style>