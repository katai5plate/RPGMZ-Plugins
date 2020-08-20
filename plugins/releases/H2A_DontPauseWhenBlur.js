/*:
 * @target MZ
 * @plugindesc フォーカスしてない時にゲームが一時停止しないようにする
 * @author Had2Apps
 * @url https://github.com/katai5plate/RPGMZ-Plugins
 * @help
 * ツクール MZ から、ゲームをフォーカスしていない時に
 * ゲームが一時停止する仕様になりました。
 * しかしそれだとデバッグ時などで都合が悪いケースがありそうです。
 * このプラグインでは、その挙動を無効にし、
 * フォーカスしていない時でもゲームを一時停止しないようにします。
 *
 * Copyright (c) 2020 Had2Apps
 * This plugin is released under the MIT License.
 *
 * 動作確認済コアバージョン: v1.0.0
 * プラグインバージョン: v1.5
 *
 * @param whenDebug
 * @text デバッグ時限定
 * @desc エディタでのデバッグ時のみ一時停止を無効化します。
 * @type boolean
 * @default true
 */

(() => {
  const params = PluginManager.parameters(
    document.currentScript.src.match(/^.*\/(.*).js$/)[1]
  );

  if (
    params.whenDebug === "false" ||
    (params.whenDebug === "true" &&
      ["test", "btest", "etest"].some((x) => Utils.isOptionValid(x)))
  )
    SceneManager.isGameActive = () => true;
})();
