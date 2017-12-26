<template>
	<div ref='zmiti-scene' class="zmiti-reuslt-main-ui lt-full">
		
		<div class="zmiti-card">
			<img src="../assets/card.png">
		</div>

		<div class="zmiti-result-btns">
			<div>再拍一张</div>
			<div>寄给朋友</div>
		</div>

		<div class="zmiti-logo zmiti-sentime-logo">
			<img src="../assets/sentime-logo.png"  />
			人脸识别技术由商汤科技提供支持
		</div>

		<div class="zmiti-logo">
			<img src="../assets/xinhua-logo.png"  />
			新华社新媒体中心  新疆分社联合出品
		</div>




<!-- 		<img src='../assets/lantern.png' ref='lantern' class="zmiti-cache-img" />
<img src='../assets/bg.jpg' ref='bg' class="zmiti-cache-img" /> -->
	</div>

</template>
<script>
import $ from 'jquery';
import './css/result.css';
	export default {
		data(){
			return {
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




			}
		},
		mounted(){
			
			//this.initWebgl();
		}
	}
</script>
 

 <style scoped>
 	.zmiti-reuslt-main-ui{
 		background: url(../assets/bg.jpg) no-repeat center;
 		background-size: cover;
 	}

 	.zmiti-result-btns>div {
	
	background: url(../assets/btn-b.png) center center;
}


 
 </style>