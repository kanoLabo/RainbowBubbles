/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
 * パーティクルモーションのクラス
 * */
var Bitmap = createjs.Bitmap;
var ParticleCreator = (function () {
    function ParticleCreator() {
        var _this = this;
        // ステージを準備
        this._canvas = document.getElementById("myCanvas");
        this._stage = new createjs.Stage(this._canvas);
        // タッチ対応
        if (createjs.Touch.isSupported()) {
            createjs.Touch.enable(this._stage);
        }
        // Tickerを作成
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", function (event) { return _this.tickeHandler(event); });
        // メインのレイヤーを配置
        this._mainLayer = new MainLayer();
        this._stage.addChild(this._mainLayer);
        // リサイズイベント
        this.resizeHandler();
        window.addEventListener("resize", function () { return _this.resizeHandler(); });
    }
    /*
     * Tick Handler
     * */
    ParticleCreator.prototype.tickeHandler = function (event) {
        if (!event.paused) {
            this._stage.update();
        }
    };
    /*
     * リサイズのイベント処理
     * */
    ParticleCreator.prototype.resizeHandler = function () {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        // ステージのサイズをwindowのサイズに変更
        this._canvas.width = windowWidth;
        this._canvas.height = windowHeight;
        // メインレイヤーにリサイズイベントを通知
        this._mainLayer.resizeHandler(windowWidth, windowHeight);
    };
    return ParticleCreator;
}());
/*
 * メインのレイヤー
 * */
var MainLayer = (function (_super) {
    __extends(MainLayer, _super);
    function MainLayer() {
        var _this = _super.call(this) || this;
        _this._tickCount = 0;
        _this._bg = new createjs.Shape();
        _this.drawBG(800, 600);
        _this.addChild(_this._bg);
        _this._particleEmitter = new ParticleEmitter(); // パーティクル発生装置のインスタンスを作成
        _this.addChild(_this._particleEmitter);
        _this.addEventListener("tick", function (event) { return _this.tickHandler(event); });
        _this.addEventListener("mousedown", function (event) { return _this.mouseDownHandler(event); });
        _this.addEventListener("pressup", function (event) { return _this.mouseUpHandler(event); });
        return _this;
    }
    MainLayer.prototype.resizeHandler = function (windowWidth, windowHeight) {
        this.drawBG(windowWidth, windowHeight);
    };
    /*
     * 指定の大きさの背景を描画
     * */
    MainLayer.prototype.drawBG = function (bgWidth, bgHeight) {
        this._bg.graphics.clear();
        this._bg.graphics.beginLinearGradientFill(["#383838", "#474747"], [0, 1], 0, 0, 0, bgHeight)
            .drawRect(0, 0, bgWidth, bgHeight)
            .endFill();
    };
    /*
     * マウスを押した時の処理
     * */
    MainLayer.prototype.mouseDownHandler = function (event) {
        this._isMouseDown = true;
    };
    /*
     * マウスを離した時の処理
     * */
    MainLayer.prototype.mouseUpHandler = function (event) {
        this._isMouseDown = false;
    };
    /*
     * Tickイベントで実行される処理
     * */
    MainLayer.prototype.tickHandler = function (event) {
        // マウスの座標
        var mouseX = this.getStage().mouseX;
        var mouseY = this.getStage().mouseY;
        // パーティクル発生装置の座標を更新
        this._particleEmitter.update(mouseX, mouseY);
        if (this._isMouseDown) {
            this._particleEmitter.emitParticle();
            this._tickCount++;
            if (this._tickCount >= 1000)
                this._tickCount = 0;
        }
    };
    return MainLayer;
}(createjs.Container));
/*
 * パーティクル発生装置
 * */
var ParticleEmitter = (function (_super) {
    __extends(ParticleEmitter, _super);
    function ParticleEmitter() {
        var _this = _super.call(this) || this;
        // アニメーション中のパーティクルを格納する配列
        _this._animationParticles = [];
        // パーティクルのオブジェクトプール。アニメーションがされていないパーティクルがここに待機している。
        _this._particlePool = [];
        _this._emitX = 0;
        _this._emitY = 0;
        _this._vx = 0;
        _this._vy = 0;
        return _this;
    }
    /*
     * MainLayerのtickイベント毎に実行される処理
     * */
    ParticleEmitter.prototype.update = function (goalX, goalY) {
        // 発生装置はgoalに徐々に近づいていく。
        var dx = goalX - this._emitX;
        var dy = goalY - this._emitY;
        var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)); // 斜め方向の移動距離
        var rad = Math.atan2(dy, dx); // 移動角度
        this._vx = Math.cos(rad) * d * 0.1; // 速度の更新
        this._vy = Math.sin(rad) * d * 0.1; // 速度の更新
        this._emitX += this._vx;
        this._emitY += this._vy;
        // アニメーション中のパーティクルの状態を更新
        this.updateParticleList();
    };
    /*
     *　パーティクルを発生させる
     * */
    ParticleEmitter.prototype.emitParticle = function () {
        var particle = this.getParticle();
        particle.init(this._emitX, this._emitY, this._vx, this._vy);
        this.addChild(particle);
        // アニメーション中のパーティクルとして設定
        this._animationParticles.push(particle);
    };
    /*
     *　パーティクルのアニメーション
     * */
    ParticleEmitter.prototype.updateParticles = function () {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        for (var i = 0; i < this._animationParticles.length; i++) {
            var particle = this._animationParticles[i];
            if (!particle.isDead) {
                if (particle.y >= windowHeight - 50) {
                    particle.vy *= -0.5;
                    particle.y = windowHeight - 50;
                }
                if (particle.x >= windowWidth) {
                    particle.vx *= -0.4;
                    particle.x = windowWidth;
                }
                else if (particle.x <= 0) {
                    particle.vx *= -0.4;
                    particle.x = 0;
                }
                particle.update();
            }
            else {
                // particleを取り除く
                this.removeParticle(particle, i);
            }
        }
    };
    /*
     * オブジェクトプールからパーティクルを取得。
     * プールにパーティクルが無ければ新規作成
     */
    ParticleEmitter.prototype.getParticle = function () {
        if (this._particlePool.length > 0) {
            return this._particlePool.shift();
        }
        else {
            return new Particle();
        }
    };
    /*
     * パーティクルを取り除く。
     * */
    ParticleEmitter.prototype.removeParticle = function (particle, animationIndex) {
        // Containerからパーティクルをremove
        this.removeChild(particle);
        // アニメーションのパーティクルから取り除く。
        this._animationParticles.splice(animationIndex, 1);
        if (this._particlePool.indexOf(particle) == -1) {
            // プールにパーティクルが無いことを確認して格納
            this._particlePool.push(particle);
        }
    };
    return ParticleEmitter;
}(createjs.Container));
/*
 * パーティクルのクラス
 * */
var Particle = (function (_super) {
    __extends(Particle, _super);
    function Particle() {
        var _this = _super.call(this) || this;
        var sudaNum = Math.floor(Math.random() * 3) + 1;
        var bitmap = new Bitmap("./images/suda" + sudaNum + ".png");
        bitmap.x = -50;
        bitmap.y = -50;
        _this.addChild(bitmap);
        // 加算で重ねる
        _this.compositeOperation = "lighter";
        _this.mouseEnabled = false;
        return _this;
    }
    /*
     * パーティクルの初期化
     * @param parentVX, parentVY :親コンテナの速度。パーティクルの速度に影響を与える。
     * */
    Particle.prototype.init = function (emitX, emitY, parentVX, parentVY) {
        this.x = emitX;
        this.y = emitY;
        this._life = 200 + Math.random() * 30;
        this._count = 0;
        this.vx = parentVX + (Math.random() - 0.5) * 10;
        this.vy = parentVY - 8 - Math.random() * 10;
        this.vr = (Math.random() - 0.5) * 5;
        this.isDead = false;
        this.alpha = 1;
        this.rotation = 50 * Math.PI * (Math.random() - 0.5);
    };
    /*
     * パーティクルの時間経過処理。
     * _countがパーティクルの年齢。
     * _lifeを超えたら死亡する。
     *
     * */
    Particle.prototype.update = function () {
        this._count++;
        if (this._count <= this._life) {
            this.x += this.vx;
            this.vy += 0.6;
            this.y += this.vy;
            this.rotation += this.vr;
            // 死にそうになったら点滅を開始
            if (this._count >= this._life / 2) {
                // this.alpha = 0.6 + Math.random() * 0.4;
                this.alpha = (1 - this._count / this._life);
            }
        }
        else {
            // 寿命が来たらフラグを立てる
            this.isDead = true;
        }
    };
    return Particle;
}(createjs.Container));
window.addEventListener("DOMContentLoaded", function (event) {
    new ParticleCreator();
});


/***/ })
/******/ ]);
//# sourceMappingURL=script.js.map