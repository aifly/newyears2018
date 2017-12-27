Array.prototype.del = function(h) {
	h.sort();
	for (var p = this.concat([]), c = h.length - 1; 0 <= c; c--) p = p.slice(0, h[c]).concat(p.slice(h[c] + 1));
	return p
};
try {
	HTMLImageElement.prototype.loadOnce = function(h) {
		var p = 0;
		this.onload = function() {
			p || h.call(this, null);
			p++
		}
	}
} catch (e$$10) {
	window = {}
}
(function(h) {
	function p() {
		this.readyState && (this.readyState = 0, this.dorsyWorker.startWorker())
	}
	var c = {
		lib: [],
		init: function() {
			this.require("config")
		},
		module: function(a, b) {
			this.lib[a] = b.call(null, this)
		},
		require: function(a) {
			var b = this,
				f = document.createElement("script");
			document.body.appendChild(f);
			f.src = "./js/module/" + a + ".js";
			f.onload = f.onerror = function(a) {
				b.handlerror(a)
			}
		},
		handlerror: function() {},
		destroySelf: function(a) {
			delete window[h];
			throw Error(a);
		},
		reflect: function(a, b, f) {
			a = this.lib.config.getModuleName(a);
			return this.lib[a].process(b, f)
		},
		reflectEasy: function(a) {
			a = this.lib.config.getEasyFun(a);
			return this.lib.easy.getFun(a)
		},
		add: function(a, b, f, i, d, g, c, m) {
			return this.lib.addLayer.add(a, b, f, i, d, g, c, m)
		},
		worker: function() {},
		applyMatrix: function() {}
	};
	window[h] = function(a, b, f) {
		if (this instanceof window[h]) {
			this.startTime = +new Date;
			var i = document.createElement("canvas"),
				d = i.getContext("2d");
			isNaN(a) ? (i.width = parseInt(a.width), i.height = parseInt(a.height), b = getComputedStyle(a), imgWidth = parseInt(b.getPropertyValue("width")),
				imgHeight = parseInt(b.getPropertyValue("height")), isNaN(imgWidth) ? d.drawImage(a, 0, 0) : d.drawImage(a, 0, 0, imgWidth, imgHeight)) : (i.width = a, i.height = b, d.fillStyle = f || "#fff", d.fillRect(0, 0, a, b));
			this.canvas = i;
			this.context = d;
			this.imgData = d.getImageData(0, 0, i.width, i.height);
			this.name = h + "_" + Math.random();
			this.canvas.id = this.name;
			this.layers = [];
			a = document.createElement("canvas");
			a.width = i.width;
			a.height = i.height;
			this.ctxCanvas = a;
			this.ctxContext = i.getContext("2d");
			this.useWorker = c.useWorker;
			this.readyState =
				1;
			this.useWorker && (this.dorsyWorker = c.lib.dorsyWorker(this))
		} else return new window[h](a, b, f)
	};
	window[h].module = function(a, b) {
		c.module(a, b)
	};
	window[h].dorsyMath = function() {
		return c.lib.dorsyMath
	};
	window[h].setName = function(a) {
		c.name = a || "alloyimage.js"
	};
	window[h].useWorker = function(a) {
		if (window.Worker) {
			a = a || "";
			/[\/\\]$/.test(a) && (a += c.name);
			"" == a && (a = "alloyimage.js");
			c.useWorker = 1;
			c.path = a;
			var b = new XMLHttpRequest;
			b.onreadystatechange = function() {
				4 == b.readyState && "404" == b.status && c.destroySelf("AI_ERROR\uff1a\u4f7f\u7528worker\u65f6\uff0cai\u6587\u4ef6\u8def\u5f84\u6307\u5b9a\u9519\u8bef\nAI_ERROR: error occured while using web worker since indicate the wrong path of file ai")
			};
			b.open("GET", a, !1);
			b.send()
		} else this.useWorker = 0, console.log("AI_WARNING: \u6d4f\u89c8\u5668\u4e0d\u652f\u6301web worker, \u81ea\u52a8\u5207\u6362\u4e3a\u5355\u7ebf\u7a0b\nAI_WARNING: the brower doesn't support Web Worker")
	};
	onmessage = function(a) {
		var a = a.data,
			b;
		"act" == a[0] ? b = c.reflect(a[1], a[2], a[3]) : "add" == a[0] && (b = c.add.apply(c, a[1]));
		postMessage(b)
	};
	window[h].prototype = {
		act: function(a, b) {
			var f = [],
				f = Array.prototype.slice.call(arguments, 1);
			this.useWorker ? (this.dorsyWorker.queue.push(["act", a, f]),
				p.call(this)) : c.reflect(a, this.imgData, f);
			return this
		},
		view: function(a, b, f, i, d) {
			var c = this.clone();
			c.type = 1;
			this.addLayer(c, "\u6b63\u5e38", 0, 0);
			c.act(a, b, f, i, d);
			return this
		},
		excute: function() {
			var a = this.layers,
				b = a.length;
			a[b - 1] && 1 == a[b - 1][0].type && (this.imgData = a[b - 1][0].imgData, delete a[b - 1])
		},
		cancel: function() {
			var a = this.layers,
				b = a.length;
			a[b - 1] && 1 == a[b - 1][0].type && delete a[b - 1]
		},
		show: function(a, b, f) {
			if (!f && this.useWorker) return this.dorsyWorker.queue.push(["show", a, b]), this;
			if (0 == this.layers.length) this.tempPsLib = {
				imgData: this.imgData
			};
			else {
				f = new window[h](this.canvas.width, this.canvas.height);
				f.add(this, "\u6b63\u5e38", 0, 0, b);
				this.tempPsLib = f;
				for (var i = 0; i < this.layers.length; i++) {
					var d = this.layers[i],
						c = d[0].layers,
						j = d[0];
					c[c.length - 1] && 1 == c[c.length - 1][0].type && (j = c[c.length - 1][0]);
					f.add(j, d[1], d[2], d[3], b)
				}
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
			}
			this.context.putImageData(this.tempPsLib.imgData, 0, 0);
			a ? document.querySelector(a).appendChild(this.canvas) : document.body.appendChild(this.canvas);
			return this
		},
		replace: function(a, b) {
			if (!b && this.useWorker) return this.dorsyWorker.queue.push(["replace", a]), p.call(this), this;
			a && (a.onload = function() {}, a.src = this.save(0, b));
			return this
		},
		add: function() {
			var a = [],
				b, f, i, d, g, j;
			for (i = 0; i < arguments.length; i++)
				if (i) switch (typeof arguments[i]) {
					case "string":
						/\d+%/.test(arguments[i]) ? f = arguments[i].replace("%", "") : /[RGB]+/.test(arguments[i]) ? j = arguments[i] : b = arguments[i];
						break;
					case "number":
						a.push(arguments[i]);
						break;
					case "boolean":
						g = arguments[i]
				}
			i = a[0] || 0;
			d = a[1] || 0;
			b = b || "\u6b63\u5e38";
			f = f / 100 || 1;
			g = g || !1;
			j = j || "RGB";
			a = arguments[0];
			this.useWorker ? (this.dorsyWorker.queue.push(["add", a, b, f, i, d, g, j]), p.call(this)) : this.imgData = c.add(this.imgData, a.imgData, b, f, i, d, g, j);
			return this
		},
		addLayer: function(a, b, f, i) {
			this.layers.push([a, b, f, i]);
			return this
		},
		clone: function() {
			var a = new window[h](this.canvas.width, this.canvas.height);
			a.context.putImageData(this.imgData, 0, 0);
			a.imgData = a.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
			return a
		},
		swap: function(a,
			b) {
			var f = this.layers[a];
			this.layers[a] = this.layers[b];
			this.layers[b] = f;
			return this
		},
		deleteLayers: function(a) {
			this.layers = this.layers.del(a)
		},
		save: function(a, b) {
			if (!b && this.useWorker) return this.dorsyWorker.queue.push(["save"]), p.call(this), this;
			if (!this.layers.length) return this.context.putImageData(this.imgData, 0, 0), this.canvas.toDataURL();
			var f = new window[h](this.canvas.width, this.canvas.height);
			f.add(this, "\u6b63\u5e38", 0, 0, a);
			this.tempPsLib = f;
			for (var i = 0; i < this.layers.length; i++) {
				var d = this.layers[i],
					c = d[0].layers,
					j = d[0];
				c[c.length - 1] && 1 == c[c.length - 1][0].type && (j = c[c.length - 1][0]);
				f.add(j, d[1], d[2], d[3], a)
			}
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.putImageData(f.imgData, 0, 0);
			return this.canvas.toDataURL()
		},
		drawRect: function() {
			var a;
			if (!(a = document.getElementById("imgRect"))) a = document.createElement("canvas"), a.id = "imgRect", document.body.appendChild(a), a.width = parseInt(this.canvas.width), a.height = parseInt(this.canvas.height);
			var b = a.getContext("2d");
			b.clearRect(0,
				0, a.width, a.height);
			for (var f = [], c = this.tempPsLib.imgData.data, d = 0, g = c.length; d < g; d++) f[c[d]] ? f[c[d]]++ : f[c[d]] = 1;
			b.beginPath();
			b.moveTo(0, a.height);
			for (d = c = 0; 255 > d; d++) f[d] > c && (c = f[d]);
			for (d = 0; 255 > d; d++) g = f[d] || 0, g = a.height - 0.8 * (g / c) * a.height, b.lineTo(d / 256 * a.width, g, 1, 1);
			b.lineTo(a.width + 10, a.height);
			b.fill()
		},
		ps: function(a) {
			var b;
			b = c.reflectEasy(a).call(this);
			this.logTime("\u7ec4\u5408\u6548\u679c" + a);
			return b
		},
		logTime: function(a) {
			console.log(a + ": " + (+new Date - this.startTime) / 1E3 + "s")
		},
		ctx: function(a) {
			var b =
				this.ctxContext;
			b.putImageData(this.imgData, 0, 0);
			a.call(b);
			this.imgData = b.getImageData(0, 0, this.canvas.width, this.canvas.height);
			return this
		},
		notify: function(a) {
			"readyStateOK" == a && (this.readyState = 1)
		},
		complete: function(a) {
			this.useWorker ? this.dorsyWorker.queue.push(["complete", a]) : a()
		}
	}
})("psLib");
window.AlloyImage = $AI = window.psLib;
(function(h) {
	window[h].module("ImageEnhance", function() {
		return {
			process: function(p) {
				for (var c = p.data, a = 0, b = c.length; a < b; a += 4);
				p.data = c;
				return p
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("addLayer", function() {
		return {
			add: function(p, c, a, b, f, i, d, g) {
				var d = p.data,
					j = c.data,
					f = f || 0,
					i = i || 0,
					b = b || 1,
					g = g || "RGB";
				/[RGB]+/.test(g) || (g = "RGB");
				for (var m = g.replace("R", "0").replace("G", "1").replace("B", "2"), k, g = p.width, h = j.length, c = c.width, m = [-1 < m.indexOf("0"), -1 < m.indexOf("1"), -1 < m.indexOf("2")], e, n, l = 0, r = d.length; l < r; l += 4)
					if (e = l / 4, n = parseInt(e / g), e %= g, n -= i, e -= f, n = n * c + e, n *= 4, 0 <= n && n < h - 4 && e < c && 0 <= e)
						for (e = 0; 3 > e && 0 != j[n + 3]; e++) switch (d[l + 3] = j[n + 3], a) {
							case "\u989c\u8272\u51cf\u6de1":
								m[e] &&
									(k = d[l + e] + d[l + e] * j[n + e] / (255 - j[n + e]), d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u53d8\u6697":
								m[e] && (k = d[l + e] < j[n + e] ? d[l + e] : j[n + e], d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u53d8\u4eae":
								m[e] && (k = d[l + e] > j[n + e] ? d[l + e] : j[n + e], d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u6b63\u7247\u53e0\u5e95":
								m[e] && (k = parseInt(d[l + e] * j[n + e] / 255), d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u6ee4\u8272":
								m[e] && (k = parseInt(255 - (255 - d[l + e]) * (255 - j[n + e]) / 255), d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u53e0\u52a0":
								m[e] && (k = 127.5 >= d[l + e] ? d[l + e] * j[n +
									e] / 127.5 : 255 - (255 - d[l + e]) * (255 - j[n + e]) / 127.5, d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u5f3a\u5149":
								m[e] && (k = 127.5 >= j[n + e] ? d[l + e] * j[n + e] / 127.5 : d[l + e] + (255 - d[l + e]) * (j[n + e] - 127.5) / 127.5, d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u5dee\u503c":
								m[e] && (k = d[l + e] > j[n + e] ? d[l + e] - j[n + e] : j[n + e] - d[l + e], d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u6392\u9664":
								m[e] && (k = d[l + e] + j[n + e] - d[l + e] * j[n + e] / 127.5, d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u70b9\u5149":
								m[e] && (k = d[l + e] < 2 * j[n + e] - 255 ? 2 * j[n + e] - 255 : d[l + e] < 2 * j[n + e] ? d[l + e] : 2 * j[n + e],
									d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u989c\u8272\u52a0\u6df1":
								m[e] && (k = 255 - 255 * (255 - d[l + e]) / j[n + e], d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u7ebf\u6027\u52a0\u6df1":
								m[e] && (k = d[l + e] + j[n + e], k = 255 < k ? k - 255 : 0, d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u7ebf\u6027\u51cf\u6de1":
								m[e] && (k = d[l + e] + j[n + e], k = 255 < k ? 255 : k, d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u67d4\u5149":
								m[e] && (k = 127.5 > j[n + e] ? ((2 * j[n + e] - 255) * (255 - d[l + e]) / 65025 + 1) * d[l + e] : (2 * j[n + e] - 255) * (Math.sqrt(d[l + e] / 255) - d[l + e] / 255) + d[l + e], d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u4eae\u5149":
								m[e] && (k = 127.5 > j[n + e] ? 255 * (1 - (255 - d[l + e]) / (2 * j[n + e])) : d[l + e] / (2 * (1 - j[n + e] / 255)), d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u7ebf\u6027\u5149":
								m[e] && (k = d[l + e] + 2 * j[n + e] - 255, k = 255 < k ? 255 : k, d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							case "\u5b9e\u8272\u6df7\u5408":
								m[e] && (k = j[n + e] < 255 - d[l + e] ? 0 : 255, d[l + e] = (1 - b) * d[l + e] + b * k);
								break;
							default:
								m[e] && (k = j[n + e], d[l + e] = (1 - b) * d[l + e] + b * k)
						}
				return p
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("brightness", function() {
		return {
			process: function(p, c) {
				for (var a = p.data, b = c[0] / 50, f = Math.tan((45 + 44 * ((c[1] || 0) / 50)) * Math.PI / 180), i = 0, d = a.length; i < d; i += 4)
					for (var g = 0; 3 > g; g++) a[i + g] = (a[i + g] - 127.5 * (1 - b)) * f + 127.5 * (1 + b);
				return p
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("applyMatrix", function(p) {
		return {
			process: function(c) {
				for (var a = c.data, b = c.width, f = new p.lib.dorsyMath.Matrix([-2, -4, -4, -4, -2, -4, 0, 8, 0, -4, -4, 8, 24, 8, -4, -4, 0, 8, 0, -4, -2, -4, -4, -4, -2], 25, 1), i = [], d = 0, g = a.length; d < g; d += 4) {
					var j = d / 4,
						m = parseInt(j / b),
						k = j % b;
					if (!(0 == m || 0 == k)) {
						for (var h = [
								[],
								[],
								[]
							], e = -2; 3 > e; e++)
							for (var n = m + e, l = -2; 3 > l; l++)
								for (var r = 4 * (n * b + (k + l)), j = 0; 3 > j; j++) h[j].push(a[r + j]);
						m = (new p.lib.dorsyMath.Matrix(h, 3, matrixSize)).mutiply(f);
						for (j = 0; 3 > j; j++) i[d + j] = m.data[j];
						i[d +
							4] = a[d + 4]
					}
				}
				d = 0;
				for (g = a.length; d < g; d++) a[d] = i[d] || a[d];
				return c
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("config", function() {
		var p = {
				"\u7070\u5ea6\u5904\u7406": "toGray",
				"\u53cd\u8272": "toReverse",
				"\u7070\u5ea6\u9608\u503c": "toThresh",
				"\u9ad8\u65af\u6a21\u7cca": "gaussBlur",
				"\u4eae\u5ea6": "brightness",
				"\u6d6e\u96d5\u6548\u679c": "embossment",
				"\u67e5\u627e\u8fb9\u7f18": "borderline",
				"\u8272\u76f8/\u9971\u548c\u5ea6\u8c03\u8282": "setHSI",
				"\u9a6c\u8d5b\u514b": "mosaic",
				"\u6cb9\u753b": "oilPainting",
				"\u8150\u8680": "corrode",
				"\u9510\u5316": "sharp",
				"\u6dfb\u52a0\u6742\u8272": "noise",
				"\u66f2\u7ebf": "curve",
				"\u6697\u89d2": "darkCorner",
				"\u55b7\u70b9": "dotted"
			},
			c = {
				"\u7f8e\u80a4": "softenFace",
				"\u7d20\u63cf": "sketch",
				"\u81ea\u7136\u589e\u5f3a": "softEnhancement",
				"\u7d2b\u8c03": "purpleStyle",
				"\u67d4\u7126": "soften",
				"\u590d\u53e4": "vintage",
				"\u9ed1\u767d": "gray",
				"\u4efflomo": "lomo",
				"\u4eae\u767d\u589e\u5f3a": "strongEnhancement",
				"\u7070\u767d": "strongGray",
				"\u7070\u8272": "lightGray",
				"\u6696\u79cb": "warmAutumn",
				"\u6728\u96d5": "carveStyle",
				"\u7c97\u7cd9": "rough"
			};
		return {
			getModuleName: function(a) {
				return p[a] ||
					a
			},
			getEasyFun: function(a) {
				return c[a] || a
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("corrode", function() {
		return {
			process: function(p, c) {
				for (var a = parseInt(c[0]) || 3, b = p.data, f = p.width, i = p.height, d = 0; d < f; d++)
					for (var g = 0; g < i; g++)
						for (var j = parseInt(2 * Math.random() * a) - a, m = parseInt(2 * Math.random() * a) - a, k = g * f + d, j = (g + j) * f + d + m, m = 0; 3 > m; m++) b[4 * k + m] = b[4 * j + m];
				return p
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("curve", function(p) {
		return {
			process: function(c, a) {
				for (var b = p.lib.dorsyMath.lagrange(a[0], a[1]), f = c.data, i = c.width, d = c.height, g = 0; g < i; g++)
					for (var j = 0; j < d; j++)
						for (var m = j * i + g, k = 0; 3 > k; k++) f[4 * m + k] = b(f[4 * m + k]);
				return c
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("darkCorner", function(p) {
		return {
			process: function(c, a) {
				for (var b = parseInt(a[0]) || 3, f = a[1] || 30, i = c.data, d = c.width, g = c.height, j = 2 * d / 3, m = 1 * g / 2, k = p.lib.dorsyMath.distance([j, m]), b = k * (1 - b / 10), h = 0; h < d; h++)
					for (var e = 0; e < g; e++)
						for (var n = e * d + h, l = 0; 3 > l; l++) {
							var r;
							r = i[4 * n + l];
							var q = (p.lib.dorsyMath.distance([h, e], [j, m]) - b) / (k - b);
							0 > q && (q = 0);
							r = (0 * Math.pow(1 - q, 3) + 0.06 * q * Math.pow(1 - q, 2) + 3 * 0.3 * q * q * (1 - q) + 1 * Math.pow(q, 3)) * r * f / 255;
							i[4 * n + l] -= r
						}
				return c
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("dorsyMath", function(p) {
		var c = {
			FFT1: function(a) {
				function b() {
					i++;
					for (var g = f / Math.pow(2, i), m = f / g, k = 0; k < g; k++)
						for (var p = k * m, e = (k + 1) * m - 1, n = i, l = Math.pow(2, n - 1), h = 0; p <= e - l; p++) {
							var q = p + l,
								u = h * f / Math.pow(2, n),
								t = u + f / 4;
							a[p] instanceof c.C || (a[p] = new c.C(a[p]));
							a[q] instanceof c.C || (a[q] = new c.C(a[q]));
							u = a[p].plus(a[q].mutiply(d[u]));
							t = a[p].plus(a[q].mutiply(d[t]));
							a[p] = u;
							a[q] = t;
							h++
						}
					1 < g && b()
				}
				for (var f = a.length, i = 0, d = [], g = 0; g < f; g++) d[g] = this.exp(-2 * Math.PI * g / f);
				b();
				return a
			},
			DFT: function() {},
			Matrix: function(a, b, f) {
				var c = [];
				if (b) {
					if (isNaN(b)) var d = /(\d+)\*/.exec(b)[1],
						b = /\*(\d+)/.exec(b)[1];
					else d = b, b = f;
					if (a[0] && a[0][0])
						for (f = 0; f < d; f++) {
							c[f] = [];
							for (var g = 0; g < b; g++) c[f][g] = a[f][g] || 0
						} else
							for (f = 0; f < d; f++) {
								c[f] = [];
								for (g = 0; g < b; g++) c[f][g] = a[f * b + g] || 0
							}
					this.m = d;
					this.n = b
				} else this.m = a.length, this.n = a[0].length;
				this.data = c
			},
			C: function(a, b) {
				this.r = a || 0;
				this.i = b || 0
			},
			exp: function(a, b) {
				var a = a || 0,
					b = b || 1,
					f = new c.C;
				f.r = b * Math.cos(a);
				f.i = b * Math.sin(a);
				return f
			},
			lagrange: function(a, b) {
				var f = a.length;
				return function(c) {
					for (var d = 0, g = 0; g < f; g++) {
						for (var j = 1, m = 1, k = 0; k < f; k++) k != g && (j *= a[g] - a[k], m *= c - a[k]);
						d += b[g] * (m / j)
					}
					return d
				}
			},
			applyMatrix: function(a, b, f) {
				for (var f = f || 0, i = a.data, d = a.width, g = b.length, b = new c.Matrix(b, g, 1), j = [], m = -(Math.sqrt(g) - 1) / 2, k = 0, h = i.length; k < h; k += 4) {
					var e = k / 4,
						n = parseInt(e / d),
						l = e % d;
					if (!(0 == n || 0 == l)) {
						for (var r = [
								[],
								[],
								[]
							], q = m; q <= -m; q++)
							for (var u = n + q, t = m; t <= -m; t++)
								for (var v = 4 * (u * d + (l + t)), e = 0; 3 > e; e++) r[e].push(i[v + e]);
						n = (new p.lib.dorsyMath.Matrix(r, 3, g)).mutiply(b);
						for (e = 0; 3 >
							e; e++) j[k + e] = n.data[e];
						j[k + 4] = i[k + 4]
					}
				}
				k = 0;
				for (h = i.length; k < h; k++) j[k] && (i[k] = j[k] < f ? j[k] : i[k]);
				return a
			},
			RGBToHSI: function(a, b, f) {
				var c = (a - b + a - f) / 2 / Math.sqrt((a - b) * (a - b) + (a - f) * (b - f)) || 0,
					c = Math.acos(c),
					c = f > b ? 2 * Math.PI - c : c,
					d = 1 - 3 * Math.min(a, b, f) / (a + b + f);
				c > 2 * Math.PI && (c = 2 * Math.PI);
				0 > c && (c = 0);
				return {
					H: c,
					S: d,
					I: (a + b + f) / 3
				}
			},
			HSIToRGB: function(a, b, f) {
				0 > a ? (a %= 2 * Math.PI, a += 2 * Math.PI) : a %= 2 * Math.PI;
				if (a <= 2 * Math.PI / 3) var c = f * (1 - b),
					d = f * (1 + b * Math.cos(a) / Math.cos(Math.PI / 3 - a)),
					g = 3 * f - (d + c);
				else a <= 4 * Math.PI / 3 ? (a -= 2 *
					Math.PI / 3, d = f * (1 - b), g = f * (1 + b * Math.cos(a) / Math.cos(Math.PI / 3 - a)), c = 3 * f - (g + d)) : (a -= 4 * Math.PI / 3, g = f * (1 - b), c = f * (1 + b * Math.cos(a) / Math.cos(Math.PI / 3 - a)), d = 3 * f - (g + c));
				return {
					R: d,
					G: g,
					B: c
				}
			},
			applyInHSI: function(a, b) {
				for (var f = a.data, c = 0, d = f.length; c < d; c += 4) {
					var g = this.RGBToHSI(f[c], f[c + 1], f[c + 2]);
					b(g);
					1 < g.S && (g.S = 1);
					0 > g.S && (g.S = 0);
					g = this.HSIToRGB(g.H, g.S, g.I);
					f[c] = g.R;
					f[c + 1] = g.G;
					f[c + 2] = g.B
				}
			},
			applyInCoordinate: function() {},
			distance: function(a, b) {
				b = b || [0, 0];
				a = new c.C(a[0], a[1]);
				b = new c.C(b[0], b[1]);
				return a.minus(b).distance()
			},
			xyToIFun: function(a) {
				return function(b, c, i) {
					return 4 * (c * a + b) + (i || 0)
				}
			},
			xyCal: function(a, b, c, i, d) {
				for (var g = this.xyToIFun(a.width), j = 0; 3 > j; j++) {
					var m = g(b, c, j);
					a[m] = i(a[m])
				}
				d && (a[m + 1] = d(a[m + 1]))
			}
		};
		c.Matrix.prototype = {
			plus: function(a) {
				if (this.m != a.m || this.n != a.n) throw Error("\u77e9\u9635\u52a0\u6cd5\u884c\u5217\u4e0d\u5339\u914d");
				for (var b = new c.Matrix([], this.m, this.n), f = 0; f < this.m; f++)
					for (var i = 0; i < this.n; i++) b.data[f][i] = this.data[f][i] + a.data[f][i];
				return b
			},
			minus: function(a) {
				if (this.m != a.m || this.n !=
					a.n) throw Error("\u77e9\u9635\u51cf\u6cd5\u6cd5\u884c\u5217\u4e0d\u5339\u914d");
				for (var b = new c.Matrix([], this.m, this.n), f = 0; f < this.m; f++)
					for (var i = 0; i < this.n; i++) b.data[f][i] = this.data[f][i] - a.data[f][i];
				return b
			},
			mutiply: function(a) {
				if (this.n != a.m) throw Error("\u77e9\u9635\u4e58\u6cd5\u884c\u5217\u4e0d\u5339\u914d");
				for (var b = new c.Matrix([], this.m, a.n), f = 0; f < this.m; f++)
					for (var i = 0; i < a.n; i++) {
						for (var d = 0, g = 0; g < this.n; g++) d += this.data[f][g] * a.data[g][i];
						b.data[f][i] = d
					}
				return b
			}
		};
		c.C.prototype = {
			plus: function(a) {
				var b =
					new c.C;
				b.r = this.r + a.r;
				b.i = this.i + a.i;
				return b
			},
			minus: function(a) {
				var b = new c.C;
				b.r = this.r - a.r;
				b.i = this.i - a.i;
				return b
			},
			mutiply: function(a) {
				var b = new c.C;
				b.r = this.r * a.r - this.i * a.i;
				b.i = this.r * a.i + this.i * a.r;
				return b
			},
			divide: function(a) {
				var b = new c.C,
					f = a.mutiply(a.conjugated()),
					a = this.mutiply(a.conjugated());
				b.r = a.r / f.r;
				b.i = a.i / f.r;
				return b
			},
			conjugated: function() {
				return new c.C(this.r, -this.i)
			},
			distance: function() {
				return Math.sqrt(this.r * this.r + this.i * this.i)
			}
		};
		return c
	})
})("psLib");
(function(h) {
	window[h].module("dorsyWorker", function(p) {
		return function(c) {
			var a = new Worker(p.path);
			if (!a) throw Error("\u4f7f\u7528worker\u65f6\uff0calloyimage\u6587\u4ef6\u76ee\u5f55\u6307\u5b9a\u51fa\u9519");
			var b = {
				queue: [],
				startWorker: function() {
					this.shiftAction()
				},
				shiftAction: function() {
					var b = this.queue.shift(),
						i = this;
					if (b) {
						var d = b[0];
						if ("act" == d) a.postMessage(["act", b[1], c.imgData, b[2]]);
						else if ("add" == d) {
							var g = function() {
								if (b[1].readyState) {
									var d = [c.imgData, b[1].imgData].concat(b.slice(2));
									a.postMessage(["add", d])
								} else setTimeout(function() {
									g()
								}, 200)
							};
							g()
						} else "show" == d ? (c.show(b[1], b[2], 1), this.shiftAction()) : "complete" == d ? (b[1] && b[1](), this.shiftAction()) : "clone" == d ? (c.clone(1), this.shiftAction()) : "save" == d ? (c.save(0, 1), this.shiftAction()) : "replace" == d && (c.replace(b[1], 1), this.shiftAction())
					} else setTimeout(function() {
						(b = i.queue.shift()) || c.notify("readyStateOK")
					}, 200)
				},
				callback: function(a) {
					c.imgData = a;
					this.shiftAction()
				}
			};
			a.onmessage = function(a) {
				b.callback(a.data)
			};
			return b
		}
	})
})("psLib");
(function(h) {
	window[h].module("dotted", function(p) {
		return {
			process: function(c, a) {
				for (var b = parseInt(a[0]) || 1, f = parseInt(a[1]) || 1, i = c.data, d = c.width, g = c.height, j = 2 * b + 1, m = [], k = f * f, f = -b; f < b; f++)
					for (var h = -b; h < b; h++) f * f + h * h > k && m.push([f, h]);
				b = p.lib.dorsyMath.xyToIFun(d);
				f = 0;
				for (d = parseInt(d / j); f < d; f++) {
					h = 0;
					for (k = parseInt(g / j); h < k; h++)
						for (var e = parseInt((f + 0.5) * j), n = parseInt((h + 0.5) * j), l = 0; l < m.length; l++) {
							var r = e + m[l][0],
								q = n + m[l][1];
							i[b(r, q, 3)] = 225;
							i[b(r, q, 2)] = 225;
							i[b(r, q, 0)] = 225;
							i[b(r, q, 1)] = 225
						}
				}
				return c
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("easy", function() {
		return {
			getFun: function(p) {
				return {
					softenFace: function() {
						return this.clone().add(this.act("\u9ad8\u65af\u6a21\u7cca", 10), "\u6ee4\u8272").act("\u4eae\u5ea6", -10, 5)
					},
					sketch: function() {
						var c = this.clone();
						return this.add(c.act("\u53cd\u8272").act("\u9ad8\u65af\u6a21\u7cca", 8), "\u989c\u8272\u51cf\u6de1").act("toGray").act("\u9510\u5316", 1)
					},
					softEnhancement: function() {
						return this.act("\u66f2\u7ebf", [0, 190, 255], [0, 229, 255])
					},
					purpleStyle: function() {
						var c = this.clone();
						return this.add(c.act("\u9ad8\u65af\u6a21\u7cca", 3), "\u6b63\u7247\u53e0\u5e95", "RG")
					},
					soften: function() {
						var c = this.clone();
						return this.add(c.act("\u9ad8\u65af\u6a21\u7cca", 6), "\u53d8\u6697")
					},
					vintage: function() {
						this.clone();
						return this.act("\u7070\u5ea6\u5904\u7406").add(window[h](this.canvas.width, this.canvas.height, "#808080").act("\u6dfb\u52a0\u6742\u8272").act("\u9ad8\u65af\u6a21\u7cca", 4).act("\u8272\u76f8/\u9971\u548c\u5ea6\u8c03\u8282", 32, 19, 0, !0), "\u53e0\u52a0")
					},
					gray: function() {
						return this.act("\u7070\u5ea6\u5904\u7406")
					},
					lomo: function() {
						return this.clone().add(this.clone(), "\u6ee4\u8272").add(this.clone(), "\u67d4\u5149").add(this.clone().act("\u53cd\u8272"), "\u6b63\u5e38", "20%", "B").act("\u6697\u89d2", 6, 200)
					},
					strongEnhancement: function() {
						return this.clone().add(this.clone().act("\u66f2\u7ebf", [0, 50, 255], [0, 234, 255]), "\u67d4\u5149")
					},
					strongGray: function() {
						return this.act("\u7070\u5ea6\u5904\u7406").act("\u66f2\u7ebf", [0, 61, 69, 212, 255], [0, 111, 176, 237, 255])
					},
					lightGray: function() {
						return this.act("\u7070\u5ea6\u5904\u7406").act("\u66f2\u7ebf", [0, 60, 142, 194, 255], [0, 194, 240, 247, 255])
					},
					warmAutumn: function() {
						var c = this.clone().act("\u8272\u76f8/\u9971\u548c\u5ea6\u8c03\u8282", 36, 47, 8, !0).act("\u6697\u89d2", 6, 150);
						return this.add(c, "\u53e0\u52a0")
					},
					carveStyle: function() {
						var c = this.clone().act("\u9a6c\u8d5b\u514b").act("\u67e5\u627e\u8fb9\u7f18").act("\u6d6e\u96d5\u6548\u679c");
						return this.add(c, "\u7ebf\u6027\u5149")
					},
					rough: function() {
						return this.add(window[h](this.canvas.width, this.canvas.height, "#000").act("\u55b7\u70b9").act("\u53cd\u8272").act("\u6d6e\u96d5\u6548\u679c"),
							"\u53e0\u52a0")
					}
				}[p]
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("embossment", function() {
		return {
			process: function(p) {
				for (var c = p.data, a = p.width, b = [], f = 0, i = c.length; f < i; f += 4) {
					var d = f / 4,
						g = parseInt(d / a),
						j = d % a,
						d = 4 * ((g - 1) * a + (j - 1)),
						m = 4 * (g + 1) * a + 4 * (j + 1);
					if (!(0 == g || 0 == j)) {
						for (g = 0; 3 > g; g++) b[f + g] = c[d + g] - c[m + g] + 127.5;
						b[f + 4] = c[f + 4]
					}
				}
				f = 0;
				for (i = c.length; f < i; f++) c[f] = b[f] || c[f];
				return p
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("gaussBlur", function() {
		return {
			process: function(p, c, a) {
				var b = p.data,
					f = p.width,
					i = p.height,
					d = [],
					g = 0,
					j, m, k, h, e, n, c = Math.floor(c) || 3,
					a = a || c / 3;
				j = 1 / (Math.sqrt(2 * Math.PI) * a);
				h = -1 / (2 * a * a);
				e = 0;
				for (a = -c; a <= c; a++, e++) k = j * Math.exp(h * a * a), d[e] = k, g += k;
				e = 0;
				for (a = d.length; e < a; e++) d[e] /= g;
				for (j = 0; j < i; j++)
					for (a = 0; a < f; a++) {
						g = m = k = h = 0;
						for (n = -c; n <= c; n++) e = a + n, 0 <= e && e < f && (e = 4 * (j * f + e), m += b[e] * d[n + c], k += b[e + 1] * d[n + c], h += b[e + 2] * d[n + c], g += d[n + c]);
						e = 4 * (j * f + a);
						b[e] = m / g;
						b[e + 1] = k / g;
						b[e + 2] = h / g
					}
				for (a =
					0; a < f; a++)
					for (j = 0; j < i; j++) {
						g = m = k = h = 0;
						for (n = -c; n <= c; n++) e = j + n, 0 <= e && e < i && (e = 4 * (e * f + a), m += b[e] * d[n + c], k += b[e + 1] * d[n + c], h += b[e + 2] * d[n + c], g += d[n + c]);
						e = 4 * (j * f + a);
						b[e] = m / g;
						b[e + 1] = k / g;
						b[e + 2] = h / g
					}
				p.data = b;
				return p
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("borderline", function(h) {
		return {
			process: function(c) {
				return h.lib.dorsyMath.applyMatrix(c, [0, 1, 0, 1, -4, 1, 0, 1, 0], 250)
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("mosaic", function() {
		return {
			process: function(h, c) {
				for (var a = parseInt(c[0]) || 3, b = h.data, f = h.width, i = h.height, a = 2 * a + 1, d = 0, g = parseInt(f / a); d < g; d++)
					for (var j = 0, m = parseInt(i / a); j < m; j++) {
						for (var k = [], s = [0, 0, 0], e = 0; e < a; e++)
							for (var n = 0; n < a; n++) {
								var l = (j * a + e) * f + d * a + n;
								s[0] += b[4 * l];
								s[1] += b[4 * l + 1];
								s[2] += b[4 * l + 2]
							}
						k[0] = s[0] / (a * a);
						k[1] = s[1] / (a * a);
						k[2] = s[2] / (a * a);
						for (e = 0; e < a; e++)
							for (n = 0; n < a; n++) l = (j * a + e) * f + d * a + n, b[4 * l] = k[0], b[4 * l + 1] = k[1], b[4 * l + 2] = k[2]
					}
				return h
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("noise", function() {
		return {
			process: function(h, c) {
				for (var a = parseInt(c[0]) || 100, b = h.data, f = h.width, i = h.height, d = 0; d < f; d++)
					for (var g = 0; g < i; g++)
						for (var j = g * f + d, m = 0; 3 > m; m++) {
							var k = parseInt(2 * Math.random() * a) - a;
							b[4 * j + m] += k
						}
				return h
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("oilPainting", function() {
		return {
			process: function(h, c) {
				for (var a = parseInt(c[0]) || 16, b = h.data, f = h.width, i = h.height, d = 0; d < f; d++)
					for (var g = 0; g < i; g++) {
						for (var j = g * f + d, m = 0, k = 0; 3 > k; k++) m += b[4 * j + k];
						m /= 3;
						m = parseInt(m / a) * a;
						for (k = 0; 3 > k; k++) b[4 * j + k] = m
					}
				return h
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("setHSI", function(h) {
		return {
			process: function(c, a) {
				a[0] = a[0] / 180 * Math.PI;
				a[1] = a[1] / 100 || 0;
				a[2] = 255 * (a[2] / 100) || 0;
				a[3] = a[3] || !1;
				h.lib.dorsyMath.applyInHSI(c, function(b) {
					a[3] ? (b.H = a[0], b.S = a[1]) : (b.H += a[0], b.S += a[1]);
					b.I += a[2]
				});
				return c
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("sharp", function() {
		return {
			process: function(h, c) {
				for (var a = c[0] || 0.6, b = h.data, f = h.width, i = 0, d = b.length; i < d; i += 4) {
					var g = i / 4,
						j = parseInt(g / f),
						m = g % f;
					if (!(0 == j || 0 == m))
						for (var k = 4 * ((j - 1) * f + (m - 1)), j = 4 * ((j - 1) * f + m), g = 4 * (g - 1), m = 0; 3 > m; m++) b[i + m] += (b[i + m] - (b[j + m] + b[g + m] + b[k + m]) / 3) * a
				}
				return h
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("toGray", function() {
		return {
			process: function(h) {
				for (var c = h.data, a = 0, b = c.length; a < b; a += 4) {
					var f = parseInt((c[a] + c[a + 1] + c[a + 2]) / 3);
					c[a + 2] = c[a + 1] = c[a] = f
				}
				h.data = c;
				return h
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("toReverse", function() {
		return {
			process: function(h) {
				for (var c = h.data, a = 0, b = c.length; a < b; a += 4) c[a] = 255 - c[a], c[a + 1] = 255 - c[a + 1], c[a + 2] = 255 - c[a + 2];
				h.data = c;
				return h
			}
		}
	})
})("psLib");
(function(h) {
	window[h].module("toThresh", function(h) {
		return {
			process: function(c, a) {
				for (var c = h.lib.toGray.process(c), b = c.data, a = a[0] || 128, f = 0, i = b.length; f < i; f++)(f + 1) % 4 && (b[f] = b[f] > a ? 255 : 0);
				c.data = b;
				return c
			}
		}
	})
})("psLib");