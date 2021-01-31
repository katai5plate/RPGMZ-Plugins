/*:
 * @target MZ
 * @plugindesc ツクール側のエラーを日本語化します。
 * @author Had2Apps
 * @url https://github.com/katai5plate/RPGMZ-Plugins
 *
 * @help
 * window.Error を書き換え、特定のエラー文字列を日本語化します。
 * Error を実行するとスタックトレースの先頭行に
 * このプラグインが占有するのでご注意ください。
 *
 * Copyright (c) 2021 Had2Apps
 * This software is released under the MIT License.
 *
 * 動作確認済コアバージョン: v1.1.1
 * プラグインバージョン: v1.0.0
 *
 */
(() => {
  window.Error = new Proxy(Error, {
    construct(target, args) {
      const [errorMessage, ...rest] = args;
      const errorPattern = [
        {
          regex: /^This is a static class$/,
          after: "静的クラスを実行しています。",
        },
        {
          regex: /^Decryption error$/,
          after: "復号できませんでした。",
        },
        {
          regex: /^Object too deep$/,
          after: "オブジェクトが深すぎます。",
        },
        {
          regex: /^Your browser does not support (.*?)\.$/,
          after:
            "お使いのブラウザは ?? に非対応のため、ゲームを起動できませんでした。",
        },
        {
          regex: /^Failed to initialize graphics\.$/,
          after:
            "グラフィックの初期化に失敗しました。お使いのブラウザの ハードウェアアクセラレーション を ON にしていただくと解決する場合があります。",
        },
        {
          regex: /^Failed to load: (.*?)$/,
          after: "ロードに失敗しました: ??",
        },
        {
          regex: /^The map data is not available$/,
          after: "マップデータがありません。",
        },
        {
          regex: /^Common event calls exceeded the limit$/,
          after: "イベントの呼び出しが上限を超えています。",
        },
        {
          regex: /^ButtonSet image is too small$/,
          after: "ボタンセット画像が小さすぎます。",
        },
        {
          regex: /^Argument must be an? (.*?)$/,
          after: "引数は ?? でなければなりません。",
        },
        {
          regex: /^Method not found: (.*?)$/,
          after: "メソッドが見つかりません: ??",
        },
        {
          regex: /^Savefile not found$/,
          after: "セーブデータがありません。",
        },
      ].find(({ regex }) => regex.test(errorMessage));
      if (!errorPattern) return new target(...args);
      const { regex, after } = errorPattern;
      const translatedErrorMessage = after.replace(
        "??",
        errorMessage.match(regex)[1]
      );
      return new target(translatedErrorMessage, ...rest);
    },
  });
})();
