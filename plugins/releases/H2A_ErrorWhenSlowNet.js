/*:
 * @target MZ
 * @plugindesc 低速回線のプレイを遮断
 * @author Had2Apps
 * @url https://github.com/katai5plate/RPGMZ-Plugins
 * @help
 * 最初の読み込み時間が指定の時間を越えると、
 * エラーメッセージを表示してゲームを中断します。
 *
 * Copyright (c) 2020 Had2Apps
 * This software is released under the MIT License.
 *
 * 動作確認済コアバージョン: v1.0.0
 * プラグインバージョン: v1.3.0
 *
 * @param timeout
 * @text タイムアウト
 * @desc 許容する読み込み時間(1秒=1000)
 * @type number
 * @default 5000
 *
 * @param message
 * @text エラー時
 * @desc タイムアウト時間を過ぎたときに表示するエラーメッセージ
 * @type multiline_string
 * @default 快適にプレイしていただくのに必要な
 * 通信速度を下回っています。
 * より高速なインターネット環境でお楽しみください。
 */

(() => {
  class ErrorWhenSlowNet {
    constructor(params) {
      this._isError = false;
      this._timeout = Number(params.timeout);
      this._message = String(params.message);
      // プラグインは Main.prototype.run() 後に呼び出される
      this.setWatch();
    }
    setWatch() {
      setTimeout(this.onTimeover.bind(this), this._timeout);
    }
    onTimeover() {
      if (this._isError) return;
      if (document.getElementById("loadingSpinner"))
        return this.throwNetworkError();
    }
    throwNetworkError() {
      this._isError = true;
      // エラー表示
      Graphics.printError("Network Speed Error", "");
      Graphics._errorPrinter.querySelector(
        "#errorMessage"
      ).innerText = this._message;
      // シーンの停止
      SceneManager.stop();
      AudioManager.stopAll();
      // スピナーの削除
      const spinner = document.getElementById("loadingSpinner");
      if (spinner) spinner.remove();
    }
  }
  const { timeout, message } = PluginManager.parameters(
    document.currentScript.src.match(/^.*\/(.*).js$/)[1]
  );
  const errorWhenSlowNet = new ErrorWhenSlowNet({ timeout, message });

  /** 関数を実行する直前にエラーが発生していたなら実行しない */
  const preApply = (target, that, args) => {
    if (errorWhenSlowNet._isError) return;
    return target.apply(that, args);
  };

  // ロード後にゲームが開始しないようにする
  Graphics._createPixiApp = new Proxy(Graphics._createPixiApp, {
    apply: preApply,
  });

  // エラーが重複して表示されないようにする
  SceneManager.initGraphics = new Proxy(SceneManager.initGraphics, {
    apply: preApply,
  });

  // 回線エラー表示中に通常のスピナー消去を行わないようにする
  Graphics.endLoading = new Proxy(Graphics.endLoading, {
    apply: preApply,
  });
})();
