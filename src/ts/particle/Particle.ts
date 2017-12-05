/**
 * パーティクルのクラス
 */
export class Particle extends createjs.Container {
  public vx: number; // 速度X
  public vy: number; // 速度Y
  public vr: number; // 回転
  public isDead: boolean;  // パーティクルが寿命を迎えたかどうか。
  private _life: number;   // パーティクルの寿命
  private _count: number;  // パーティクルの年齢。時間経過とともに加算されていく。

  public constructor() {

    super();

    const sudaNum: number = Math.floor(Math.random() * 3) + 1;

    const bitmap: createjs.Bitmap = new createjs.Bitmap(`./images/suda${sudaNum}.png`);
    bitmap.x = -50;
    bitmap.y = -50;
    this.addChild(bitmap);

    // 加算で重ねる
    this.compositeOperation = "lighter";
    this.mouseEnabled = false;
  }

  /**
   * パーティクルの初期化
   * @param parentVX, parentVY :親コンテナの速度。パーティクルの速度に影響を与える。
   */
  public init(emitX: number,
              emitY: number,
              parentVX: number,
              parentVY: number): void {
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
  }

  /**
   * パーティクルの時間経過処理。
   * _countがパーティクルの年齢。
   * _lifeを超えたら死亡する。
   *
   */
  update(): void {
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
  }
}
