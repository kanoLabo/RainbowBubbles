import {Particle} from "./Particle";
import {ParticleSettingData} from "./ParticleSettingData";

/**
 * パーティクル発生装置
 */
export class ParticleEmitter extends createjs.Container {
  // パーティクルの発生座標。発生装置そのものの座標ではない。
  private _emitX: number;
  private _emitY: number;
  // 発生座標に近づく速度
  private _vx: number;
  private _vy: number;
  // アニメーション中のパーティクルを格納する配列
  private _animationParticles: Particle[] = [];
  // パーティクルのオブジェクトプール。アニメーションがされていないパーティクルがここに待機している。
  private _particlePool: Particle[] = [];

  private _browserNum: number;

  private _data: ParticleSettingData;

  public constructor() {
    super();
  }

  public init(data: ParticleSettingData) {
    this._data = data;
    this._emitX = 0;
    this._emitY = 0;
    this._vx = 0;
    this._vy = 0;
  }

  /**
   * MainLayerのtickイベント毎に実行される処理
   */
  public update(goalX: number, goalY: number) {
    // 発生装置はgoalに徐々に近づいていく。
    let dx: number = goalX - this._emitX;
    let dy: number = goalY - this._emitY;
    let d: number = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));  // 斜め方向の移動距離
    let rad: number = Math.atan2(dy, dx);    // 移動角度
    this._vx = Math.cos(rad) * d * 0.1; // 速度の更新
    this._vy = Math.sin(rad) * d * 0.1; // 速度の更新
    this._emitX += this._vx;
    this._emitY += this._vy;
    // アニメーション中のパーティクルの状態を更新
    this.updateParticleList();
  }

  /**
   * パーティクルを発生させる
   */
  public emitParticle(): void {
    let particle: Particle = this.getParticle();
    particle.init(this._emitX, this._emitY, this._vx, this._vy);
    this.addChild(particle);
    // アニメーション中のパーティクルとして設定
    this._animationParticles.push(particle);
  }

  /**
   * パーティクルのアニメーション
   */
  private updateParticleList(): void {
    let windowWidth: number = window.innerWidth;
    let windowHeight: number = window.innerHeight;

    for (let i: number = 0; i < this._animationParticles.length; i++) {
      this.updateParticle(i, windowHeight, windowWidth);
    }
  }

  private updateParticle(i: number, windowHeight: number, windowWidth: number) {
    let particle: Particle = this._animationParticles[i];
    if (!particle.isDead) {
      if (this._data.bounse) {
        this.checkParticleBounse(particle, windowHeight, windowWidth);
      }

      particle.update();
    }
    else {
      // particleを取り除く
      this.removeParticle(particle, i);
    }
  }

  private checkParticleBounse(particle: Particle, windowHeight: number, windowWidth: number) {
    if (particle.y >= windowHeight - 50) {
      particle.vy *= -0.5;
      particle.y = windowHeight - 50;
    }

    if (particle.x >= windowWidth) {
      particle.vx *= -0.4;
      particle.x = windowWidth;
    } else if (particle.x <= 0) {
      particle.vx *= -0.4;
      particle.x = 0;
    }
  }

  /**
   * オブジェクトプールからパーティクルを取得。
   * プールにパーティクルが無ければ新規作成
   */
  private getParticle(): Particle {
    if (this._particlePool.length > 0) {
      return this._particlePool.shift();
    }
    else {
      return new Particle();
    }
  }

  /**
   * パーティクルを取り除く。
   */
  private removeParticle(particle: Particle, animationIndex: number): void {
    // Containerからパーティクルをremove
    this.removeChild(particle);
    // アニメーションのパーティクルから取り除く。
    this._animationParticles.splice(animationIndex, 1);
    if (this._particlePool.indexOf(particle) === -1) {
      // プールにパーティクルが無いことを確認して格納
      this._particlePool.push(particle);
    }
  }
}
