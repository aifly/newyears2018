<template>
	<div v-if='showResult'  :class='{"show":showMain}' ref='zmiti-scene' class="zmiti-reuslt-main-ui  lt-full">
		<audio src='../assets/photo.mp3' ref='photo-audio'></audio>
		<div class="zmiti-card " :class="{'active':clipResultImg}" ref='zmiti-card'>
			<img :src='clipResultImg' v-if='clipResultImg'/>
			<div v-if='!clipResultImg'>
				<img src="../assets/card.png">
				<canvas ref='canvas' class="zmiti-canvas" :width='viewW*.7' :height="viewW*.8"></canvas>
				<div class="zmiti-reuslt-main" :class='{"active":showMain,"hideline":hideLine,"lantern-up":lanternUp}'>
					
					<div class="zmiti-headimg">
						<div>
							<img :src='clipImg'>
						</div>

						<img src="../assets/shadow.png" class="zmiti-shadow">
						
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

				<div class="zmiti-badge">
						<img src='../assets/badge.png'/>
						<span v-html='"【"+(avg|0)+"】"'></span>
					</div>

				<div class="zmiti-result-img" >
					<img v-if='i === srcIndex' :src='"../assets/"+i+".gif"' v-for="i in [0,1,2,3,4,5,6,7,8,9,10,11]" />
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

		<div v-if='clipResultImg' class="zmiti-result-copyright">
			
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
				clipResultImg:'',
				showMask:false,
				showMain:true,
				hideLine:true,
				lanternUp:true,
				rePhoto:true,
				sendToFriend:false,
				viewW:document.documentElement.clientWidth,
				viewH:document.documentElement.clientHeight
			}
		},
		methods:{
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
			},

			badgeUp(){
				this.showMain = this.hideLine = this.lanternUp = true;
			}
		},


		computed :{
			
		},

		mounted(){
			 
			var {obserable} = this;
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
					
				var dom = this.$refs['zmiti-card'];
				

					html2canvas(dom, {
					      useCORS: true,
					      onrendered: function(canvas) {
					        var url = canvas.toDataURL();

					        $.ajax({
					          url: 'http://api.zmiti.com/v2/share/base64_image/',
					          type: 'post',
					          data: {
					            setcontents: url,
					            setwidth: dom.offsetWidth,
					            setheight: dom.offsetHeight
					          },
					          success: function(data) {
					            if (data.getret === 0) {
					              var src = data.getimageurl;
									console.log(src)	

									var img = new Image();
									img.onload =()=>{
										s.$refs['photo-audio'].play()
										//s.clipResultImg = src;
									}	
									img.src = src;			            
					            }

					          }
					        })


					      },
					      width: dom.offsetWidth,
					      height: dom.offsetHeight
					    });

				},1000)
			})


		
			
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