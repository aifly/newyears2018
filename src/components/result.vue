<template>
	<div v-if='showResult' ref='zmiti-scene' class="zmiti-reuslt-main-ui lt-full">
		
		<div class="zmiti-card">
			<img src="../assets/card.png">
			<canvas ref='canvas' class="zmiti-canvas" :width='viewW*.7' :height="viewW*.8"></canvas>
		</div>

		<div class="zmiti-reuslt-main" :class='{"active":showMain,"hideline":hideLine,"lantern-up":lanternUp}'>
			<div class="zmiti-badge">
				<img src='../assets/badge.png'/>
				<span v-html='avg+"分"'></span>
			</div>

			<div class="zmiti-lantern">
				<img src="../assets/lantern.png" ref='lantern' >
			</div>

			<div class="zmiti-lantern1">
				<img src="../assets/lantern.png" ref='lantern' >
			</div>
		</div>

		<div class="zmiti-headimg">
			<img :src='clipImg' v-if='clipImg'>

			<img src="../assets/shadow.png" class="zmiti-shadow">
		</div>

		<div class="zmiti-result-btns">
			<div @touchstart='rePhoto=true' @touchend='rePhoto=false' :class='{"active":rePhoto}'>再拍一张</div>
			<div @touchstart='sendToFriend=true' @touchend='sendToFriend=false' :class='{"active":sendToFriend}'>寄给朋友</div>
		</div>

		<div class="zmiti-result-copyright">
			<div class="zmiti-logo zmiti-sentime-logo">
				<img src="../assets/sentime-logo.png"  />
				人脸识别技术由商汤科技提供支持
			</div>
			<div class="zmiti-logo">
				<img src="../assets/xinhua-logo.png"  />
				新华社新媒体中心  新疆分社联合出品
			</div>

		</div>



<!-- 		<img src='../assets/lantern.png' ref='lantern' class="zmiti-cache-img" />
<img src='../assets/bg.jpg' ref='bg' class="zmiti-cache-img" /> -->
	</div>

</template>
<script>
import $ from 'jquery';
import './css/result.css';
	export default {
		props:['showResult','avg','clipImg'],
		data(){
			return {
				showMain:false,
				hideLine:false,
				lanternUp:false,
				rePhoto:false,
				sendToFriend:false,
				viewW:document.documentElement.clientWidth,
				viewH:document.documentElement.clientHeight
			}
		},
		methods:{

			initControls(){
				var scene = new THREE.Scene();
				var camera = new THREE.PerspectiveCamera( 45,this.viewW/this.viewH, .1, 1000 );
				scene.background = new THREE.Color(0x333333);
				console.log(this.$refs['bg'].src)
				//scene.background  = new THREE.TextureLoader().load('http://localhost:8080/static/img/bg.e9a4d91.jpg');
				var renderer = new THREE.WebGLRenderer();
				camera.position.set(0,0,110);
				camera.lookAt(scene.position);
				renderer.setSize(this.viewW,this.viewH);
				this.$refs['zmiti-scene'].appendChild(renderer.domElement);

				var lanternGeo = new THREE.PlaneGeometry( 6,8,10,100);
				var lanternMaterail = new THREE.MeshLambertMaterial({map:new THREE.TextureLoader().load(this.$refs['lantern'].src)});
				var lantern = new THREE.Mesh(lanternGeo,lanternMaterail);
					lanternMaterail.transparent = true;
					lantern.position.set(20,30,5)
				scene.add(lantern);

				var ambLight = new THREE.AmbientLight( 0xffffff);//0xfefbc8
				scene.add(ambLight);


				var SpotLight = new THREE.PointLight(0xf00000,1,100);
				SpotLight.position.set(10,40,0)
				scene.add(SpotLight);




				return {
					scene,camera,renderer
				}
			},

			initWebgl(){
				var {scene,camera,renderer} = this.initControls();
				//
				scene.add(camera);

				

				var zmitiRequestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
				var render=()=>{

					zmitiRequestAnimationFrame(render);
					renderer.render(scene,camera);
				}

				render();

			},
			initCanvas(){

				var rem = this.viewW / 10;
				var canvas = this.$refs['canvas'];
				var context = canvas.getContext('2d');

				var img = this.$refs['lantern'];
				img.onload = ()=>{
					context.drawImage(img,5*rem,0,1.5*rem,2*rem);
				}

			},
			badgeUp(){
				this.showMain = this.hideLine = this.lanternUp = true;
			}
		},
		mounted(){

			setTimeout(()=>{
				this.badgeUp()
			},100)
			
			
			//this.initWebgl();
		}
	}
</script>
 

 <style scoped>
 	.zmiti-reuslt-main-ui{
 		background: url(../assets/bg.jpg) no-repeat center;
 		background-size: cover;
 		z-index: 2;
 	}

 	.zmiti-result-btns>div {
	
	background: url(../assets/btn-b.png) center center;
}

.zmiti-headimg{
	background: url(../assets/shadow.png) no-repeat;
	background-size: contain;
}


 
 </style>