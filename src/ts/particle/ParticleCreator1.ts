import {MainLayer} from "./MainLayer";
import {ParticleSettingData} from "./ParticleSettingData";

export default class ParticleCreator1 {
  private _stage: createjs.Stage;  // ステージ
  private _canvas: HTMLCanvasElement;  // ステージ
  private _mainLayer: MainLayer;   // メインのレイヤー

  public constructor() {
  }

  public init(data: ParticleSettingData): void {
    // ステージを準備
    this._canvas = <HTMLCanvasElement> document.getElementById("myCanvas");
    this._stage = new createjs.Stage(this._canvas);

    // タッチ対応
    if (createjs.Touch.isSupported()) {
      createjs.Touch.enable(this._stage);
    }

    // Tickerを作成
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", (event) => this.tickeHandler(event));
    // メインのレイヤーを配置
    this._mainLayer = new MainLayer();
    this._mainLayer.init(data);
    this._stage.addChild(this._mainLayer);
    // リサイズイベント
    this.resizeHandler();
    window.addEventListener("resize", () => this.resizeHandler());
  }

  /*
   * Tick Handler
   * */
  private tickeHandler(event): void {
    if (!event.paused) {
      this._stage.update();
    }
  }

  /*
   * リサイズのイベント処理
   * */
  private resizeHandler(): void {
    let windowWidth: number = window.innerWidth;
    let windowHeight: number = window.innerHeight;
    // ステージのサイズをwindowのサイズに変更
    this._canvas.width = windowWidth;
    this._canvas.height = windowHeight;
    // メインレイヤーにリサイズイベントを通知
    this._mainLayer.resizeHandler(windowWidth, windowHeight);
  }
}