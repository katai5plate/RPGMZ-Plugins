/*:
 * @target MZ
 * @plugindesc タイトルをスキップします
 * @author Had2Apps
 * @url https://github.com/katai5plate/RPGMZ-Plugins
 * @help
 * タイトルをスキップし、
 * ニューゲームかコンティニューします。
 *
 * Copyright (c) 2020 Had2Apps
 * This software is released under the MIT License.
 *
 * 動作確認済コアバージョン: v1.0.0
 * プラグインバージョン: v1.0.0
 *
 * @param mode
 * @text モード
 * @desc タイトルスキップ時の挙動
 * @type select
 * @option セーブ無:ニューゲーム,有:直前のセーブ
 * @value newlast
 * @option セーブ無:ニューゲーム,有:オートセーブ
 * @value newauto
 * @option ニューゲーム
 * @value new
 * @option 直前のセーブ
 * @value last
 * @option オートセーブ
 * @value auto
 * @default newlast
 */

(() => {
  const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
  const { mode } = PluginManager.parameters(pluginName);

  const skipTitle = (mode) => {
    const moveToSceneMap = (isContinue = false) => {
      SceneManager.goto(Scene_Map);
      isContinue && $gameSystem.onAfterLoad();
    };
    const saveIsExist = () => DataManager.isAnySavefileExists();
    const autoSaveIsExist = () => DataManager.savefileExists(0);
    const toNewGame = () => {
      DataManager.setupNewGame();
      moveToSceneMap();
    };
    const toLastSave = () => {
      DataManager.loadGame(DataManager.latestSavefileId()).then(() =>
        moveToSceneMap(true)
      );
    };
    const toAutoSave = () => {
      DataManager.loadGame(0).then(() => moveToSceneMap(true));
    };
    switch (mode) {
      case "newlast":
        if (saveIsExist()) return toLastSave();
        return toNewGame();
      case "newauto":
        if (autoSaveIsExist()) return toAutoSave();
        return toNewGame();
      case "new":
        return toNewGame();
      case "last":
        if (saveIsExist()) throw new Error("セーブデータが見つかりません");
        return toLastSave();
      case "auto":
        if (autoSaveIsExist()) throw new Error("オートセーブが見つかりません");
        return toAutoSave();
      default:
        throw new Error("無効な設定");
    }
  };

  Scene_Boot.prototype.start = new Proxy(Scene_Boot.prototype.start, {
    apply(target, that, args) {
      target.apply(that, args);
      return skipTitle(mode);
    },
  });
})();
