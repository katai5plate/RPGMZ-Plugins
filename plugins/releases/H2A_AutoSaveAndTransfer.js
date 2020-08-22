/*:
 * @target MZ
 * @plugindesc オートセーブと場所移動の挙動を変更
 * @author Had2Apps
 * @url https://github.com/katai5plate/RPGMZ-Plugins
 * @help
 * 同一マップ間移動時に、
 * データのロードが発生しないようにします。
 *
 * また、パラメーターで
 * オートセーブに関する挙動を設定できます。
 * その場合、「システム1」のオプションで
 * 「オートセーブを有効化」する必要があります。
 *
 * またプラグインコマンドを使用することで、
 * オートセーブを呼び出すことができます。
 *
 * Copyright (c) 2020 Had2Apps
 * This software is released under the MIT License.
 *
 * 動作確認済コアバージョン: v1.0.0
 * プラグインバージョン: v1.0.0
 *
 * @param autosaveMode
 * @text オートセーブ設定
 * @desc 場所移動時のオートセーブの挙動を設定します。
 * @type select
 * @option いかなる場所移動であっても許可する
 * @value all
 * @option 同一マップ間移動では禁止する
 * @value nosame
 * @option 場所移動でのオートセーブを禁止する
 * @value disable
 * @default all
 *
 * @command autosave
 * @text オートセーブ
 * @desc オートセーブを行います。
 *
 */
(() => {
  const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
  const { autosaveMode } = PluginManager.parameters(pluginName);

  let prevMapId = 0;

  PluginManager.registerCommand(pluginName, "autosave", () => {
    Scene_Map.prototype.requestAutosave();
  });

  Scene_Map.prototype.create = function () {
    Scene_Message.prototype.create.call(this);
    this._transfer = $gamePlayer.isTransferring();
    this._lastMapWasNull = !$dataMap;
    // 移動前のマップID
    prevMapId = $gameMap.mapId();
    if (this._transfer) {
      // 同一マップ内での移動の場合
      if ($gameMap.mapId() !== $gamePlayer.newMapId()) {
        DataManager.loadMapData($gamePlayer.newMapId());
        this.onTransfer();
      }
    } else if (!$dataMap || $dataMap.id !== $gameMap.mapId()) {
      DataManager.loadMapData($gameMap.mapId());
    }
  };
  Scene_Map.prototype.start = function () {
    Scene_Message.prototype.start.call(this);
    SceneManager.clearStack();
    if (this._transfer) {
      this.fadeInForTransfer();
      // 同一マップ内での移動ではない場合
      if ($gameMap.mapId() !== prevMapId) {
        this.onTransferEnd();
      }
    } else if (this.needsFadeIn()) {
      this.startFadeIn(this.fadeSpeed(), false);
    }
    this.menuCalling = false;
  };

  Scene_Map.prototype.onTransferEnd = function () {
    const isDifferent = $gameMap.mapId() !== prevMapId;
    // 異なるマップへの場所移動
    if (isDifferent) {
      this._mapNameWindow.open();
      $gameMap.autoplay();
    }
    // オートセーブ
    if (this.shouldAutosave()) {
      switch (autosaveMode) {
        case "all":
          return this.requestAutosave();
        case "nosame":
          if (isDifferent) return this.requestAutosave();
          return;
        case "disable":
          return;
        default:
          throw new Error("無効なパラメーター");
      }
    }
  };
})();
