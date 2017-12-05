/**
 * メインのレイヤー
 */
import {ParticleEmitter} from "./ParticleEmitter";

export class MainLayer extends createjs.Container {
  private _isMouseDown: boolean;   // マウスが押されているかどうか
  private _particleEmitter: ParticleEmitter;   // パーティクル発生装置のインスタンス
  private _bg: createjs.Shape; // 背景
  private _tickCount: number = 0;

  public constructor() {
    super();
  }

  public init(): void {
    this._bg = new createjs.Shape();
    this.drawBG(800, 600);
    this.addChild(this._bg);
    this._particleEmitter = new ParticleEmitter();  // パーティクル発生装置のインスタンスを作成
    this._particleEmitter.init();
    this.addChild(this._particleEmitter);

    this.addEventListener("tick", (event) => this.tickHandler(event));
    this.addEventListener("mousedown", (event) => this.mouseDownHandler(event));
    this.addEventListener("pressup", (event) => this.mouseUpHandler(event));
  }

  public resizeHandler(windowWidth: number, windowHeight: number): void {
    this.drawBG(windowWidth, windowHeight);
  }

  /*
   * 指定の大きさの背景を描画
   * */
  private drawBG(bgWidth: number, bgHeight: number): void {
    this._bg.graphics.clear();
    this._bg.graphics.beginLinearGradientFill(["#222222", "#1f1f1f"], [0, 1], 0, 0, 0, bgHeight)
      .drawRect(0, 0, bgWidth, bgHeight)
      .endFill();
  }

  /*
   * マウスを押した時の処理
   * */
  private mouseDownHandler(event): void {
    this._isMouseDown = true;
  }

  /**
   * マウスを離した時の処理
   */
  private mouseUpHandler(event): void {
    this._isMouseDown = false;
  }

  /**
   * Tickイベントで実行される処理
   */
  private tickHandler(event): void {

    // マウスの座標
    let mouseX: number = this.getStage().mouseX;
    let mouseY: number = this.getStage().mouseY;
    // パーティクル発生装置の座標を更新
    this._particleEmitter.update(mouseX, mouseY);

    if (this._isMouseDown) {
      this._particleEmitter.emitParticle();
      this._tickCount++;

      if (this._tickCount >= 1000) {
        this._tickCount = 0;
      }
    }
  }
}
