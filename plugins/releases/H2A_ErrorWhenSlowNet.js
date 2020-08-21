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
 * プラグインバージョン: v1.0
 *
 * @param timeout
 * @text タイムアウト
 * @desc 許容する読み込み時間(秒)
 * @type number
 * @default 3
 *
 * @param message
 * @text エラー
 * @desc タイムアウト時間を過ぎたときに表示するエラーメッセージ
 * @type multiline_string
 * @default インターネット通信が遅すぎます。
 * より高速なインターネット環境でお試しください。
 */

(() => {
  class ErrorWhenSlowNet {
    constructor(params) {
      this._wasError = false;
      this._timeout = Number(params.timeout);
      this._message = String(params.message);
      // プラグインは Main.prototype.run() 後に呼び出される
      this.setWatch();
    }
    setWatch() {
      setTimeout(this.onTimeup.bind(this), Number(timeout) * 1000);
    }
    onTimeup() {
      if (this._wasError) return;
      if (document.getElementById("loadingSpinner"))
        return this.throwNetworkError();
    }
    throwNetworkError() {
      this._wasError = true;
      Graphics.printError("Network Speed Error", "");
      Graphics._errorPrinter.querySelector("#errorMessage").innerText = message;
      SceneManager.stop();
      AudioManager.stopAll();
    }
  }
  const { timeout, message } = PluginManager.parameters(
    document.currentScript.src.match(/^.*\/(.*).js$/)[1]
  );
  const errorWhenSlowNet = new ErrorWhenSlowNet({ timeout, message });

  // ロード後にゲームが開始しないようにする
  Graphics._createPixiApp = new Proxy(Graphics._createPixiApp, {
    apply(target, that, args) {
      if (errorWhenSlowNet._wasError) return;
      return target.apply(that, args);
    },
  });

  // エラーが重複して表示しないようにする
  SceneManager.initGraphics = new Proxy(SceneManager.initGraphics, {
    apply(target, that, args) {
      if (errorWhenSlowNet._wasError) return;
      return target.apply(that, args);
    },
  });

  // 回線エラー表示中に通常のスピナー消去を行わないようにする
  Graphics.endLoading = new Proxy(Graphics.endLoading, {
    apply(target, that, args) {
      if (errorWhenSlowNet._wasError) return;
      return target.apply(that, args);
    },
  });
})();
