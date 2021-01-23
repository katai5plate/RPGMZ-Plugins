/*:
 * @target MZ
 * @plugindesc キャラにリージョンを辿って歩かせる
 * @author Had2Apps
 * @url https://github.com/katai5plate/RPGMZ-Plugins
 *
 * @param isStrict
 * @text 厳格モード
 * @desc エラーによる強制終了と警告を有効にします。
 * @type boolean
 * @default true
 *
 * @param enableRandomWalk
 * @text ランダム歩行
 * @desc 移動経路が 2 方向以上ある場合、ランダムに決定します。
 * @type boolean
 * @default false
 *
 * @param addOneStep
 * @text 到着したら一歩前進
 * @desc 終端に辿り着いたら、一歩前進します。
 * @type boolean
 * @default false
 *
 * @command run
 * @text 実行
 * @desc リージョン ID の道が途切れるまで移動し続けます。
 * @arg regionId
 *  @text リージョン ID
 *  @desc ルート指定に使用するリージョン ID
 *  @type number
 *  @min 1
 *  @default 1
 * @arg characterId
 *  @text イベント ID
 *  @desc 移動する マップイベント ID (主人公: -1)
 *  @type number
 *  @min -1
 *  @default -1
 * @arg initDirection
 *  @text 歩き始める方角
 *  @desc どの方角を正面として歩き始めるかを設定します。
 *  @type select
 *  @option 現在の向き
 *  @value -1
 *  @option 下
 *  @value 2
 *  @option 左
 *  @value 4
 *  @option 右
 *  @value 6
 *  @option 上
 *  @value 8
 *  @default -1
 * @arg walkSpeed
 *  @text 移動速度
 *  @desc 歩くスピード
 *  @type select
 *  @option 指定しない
 *  @value 0
 *  @option 1: 1/8倍速
 *  @value 1
 *  @option 2: 1/4倍速
 *  @value 2
 *  @option 3: 1/2倍速
 *  @value 3
 *  @option 4: 標準速
 *  @value 4
 *  @option 5: 2倍速
 *  @value 5
 *  @option 6: 4倍速
 *  @value 6
 *  @default 0
 * @arg wait
 *  @text 完了までウェイト
 *  @desc 終端に辿りつくまでウェイトします。
 *  @type boolean
 *  @default true
 * @arg through
 *  @text すり抜ける
 *  @desc すり抜けを ON にします
 *  @type boolean
 *  @default false
 * @arg endSwitch
 *  @text 移動完了スイッチ
 *  @desc スイッチを指定すると、移動が終わったら自動で ON になります。
 *  @type switch
 *  @default 0
 *
 * @command wait
 * @text 移動完了まで待つ
 * @desc スイッチが ON になるまでウェイトします。
 * @arg endSwitch
 *  @text 移動完了スイッチ
 *  @desc 「実行」で指定したスイッチ
 *  @type switch
 *  @default 1
 *
 * @help
 * キャラクターがリージョンに沿って移動します。
 * 真後ろには移動せず、前方から見て前・左・右にのみ動きます。
 *
 * ・「厳格モード」では、通行を妨げるタイルがあったり、
 * 　ランダム歩行が無効なのに一本道ではない場合に、
 * 　コンソールに警告を出したり、エラーでゲームを強制終了します。
 * ・「ランダム歩行」では、一本道でない道に来た時、
 * 　ランダムで方角を決定します。
 * ・通常、行き止まりに到達して立ち止まった時は、
 * 　終端のリージョンを踏んでいる状態になります。
 * 　そのため、到達時にリージョンの外まで歩かせたい場合は
 * 　「到着したら一歩前進」を有効化してください。
 *
 * [注意]
 * ・移動が終わるまでウェイトになるため、
 * 　経路の途中にイベント等があると、
 * 　そのままゲームが先に進まなくなる可能性があります。
 *
 * [既知のバグ]
 * ・「歩き始める方角」が正しく機能しない時がある。
 *
 * Copyright (c) 2021 Had2Apps
 * This software is released under the MIT License.
 *
 * 動作確認済コアバージョン: v1.1.1
 * プラグインバージョン: v1.0.3
 *
 */

// 没機能
// 没理由: ランダムの場合、移動ルートをキャラ毎にどこかに記録しておくか、再走する必要があるため。
// * @arg repeat
// *  @text 動作を繰り返す
// *  @desc 終端に辿りつくと、道を引き返しループします。
// *  @type boolean
// *  @default false
// * @arg onTurnFlame
// *  @text 振り向きウェイト
// *  @desc 「動作を繰り返す」場合、引き返す時にクルッと向きを回転するのにかかる時間を指定します。
// *  @type number
// *  @min 1
// *  @default 30
// * @arg onTurnDir
// *  @text 振り向き方向
// *  @desc 「動作を繰り返す」場合、引き返す時にクルッと向きを回転する向きを指定します
// *  @type select
// *  @option ランダム
// *  @value random
// *  @option 左
// *  @value left
// *  @option 右
// *  @value right
// *  @default random

(() => {
  const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
  const { isStrict, enableRandomWalk, addOneStep } = PluginManager.parameters(
    pluginName
  );

  const isStrictMode = isStrict === "true";
  const isRandomWalk = enableRandomWalk === "true";
  const isOneStep = addOneStep === "true";

  /** 任意のコマンドをねじ込んだ list を取得 */
  const getInjectedListCommands = (list, index, commands = []) => {
    return [
      ...list.slice(0, index + 1),
      ...commands.map(({ indent, ...c }) => ({
        indent: list[index].indent + indent,
        ...c,
      })),
      ...list.slice(index + 1),
    ];
  };
  /** @returns {{dir:number,after:{x:number,y:number}}|null|never} */
  const getRegionSearchTarget = ({ regionId, target }) => {
    const candidates = [{ y: 1 }, { x: -1 }, { x: 1 }, { y: -1 }]
      .map(({ x, y }, i) => ({
        x: target.x + (x || 0),
        y: target.y + (y || 0),
        d: +"2468"[i], // 正面
        r: +"8642"[i], // 背後
      }))
      .filter(({ r }) => r !== target.direction)
      .reduce((p, { x, y, d }) => {
        const id = $gameMap.regionId(x, y);
        if (id === regionId) return [...p, { dir: d, after: { x, y } }];
        return p;
      }, []);
    if (candidates.length === 1) {
      const result = candidates[0];
      if (!$gameMap.isPassable(result.after.x, result.after.y) && isStrictMode)
        console.warn("厳格モード: 移動不可能な道が含まれています。");
      return candidates[0];
    }
    if (candidates.length > 1) {
      if (isRandomWalk)
        return candidates[Math.floor(Math.random() * candidates.length)];
      if (isStrictMode)
        throw new Error("厳格モード: 移動候補が 2 件以上あります。");
      return null;
    }
    return null;
  };

  PluginManager.registerCommand(
    pluginName,
    "run",
    function ({
      regionId,
      characterId,
      initDirection,
      walkSpeed,
      wait,
      through,
      endSwitch,
      // repeat,
      // onTurnFlame,
      // onTurnDir,
    }) {
      // const isRepeat = repeat === "true";
      const speed = +walkSpeed;
      const isThrough = through === "true";
      const endSwitchId = +endSwitch;
      const { x, y, _direction } = Game_Interpreter.prototype.character(
        characterId
      );
      let virtualTarget = {
        x,
        y,
        direction: initDirection ? +initDirection : _direction,
      };
      let routeList = [];
      let loopIndex = 0;
      const loopMax = 100000;
      if (speed) {
        routeList = [
          ...routeList,
          {
            code: Game_Character.ROUTE_CHANGE_SPEED,
            parameters: [speed],
            indent: null,
          },
        ];
      }
      for (loopIndex = 0; loopIndex < loopMax; loopIndex++) {
        const result = getRegionSearchTarget({
          regionId: +regionId,
          target: virtualTarget,
        });
        if (result === null) break;
        const { dir, after } = result;
        virtualTarget = { x: after.x, y: after.y, direction: dir };
        routeList = [
          ...routeList,
          {
            code: {
              2: Game_Character.ROUTE_MOVE_DOWN,
              4: Game_Character.ROUTE_MOVE_LEFT,
              6: Game_Character.ROUTE_MOVE_RIGHT,
              8: Game_Character.ROUTE_MOVE_UP,
            }[dir],
            indent: null,
          },
        ];
      }
      if (loopIndex === loopMax)
        throw new Error("経路探索数が " + loopMax + "を超えました。");
      // if (isRepeat) {
      //   const turnDir =
      //     onTurnDir === "left"
      //       ? Game_Character.ROUTE_TURN_90D_L
      //       : onTurnDir === "right"
      //       ? Game_Character.ROUTE_TURN_90D_R
      //       : [
      //           Game_Character.ROUTE_TURN_90D_L,
      //           Game_Character.ROUTE_TURN_90D_R,
      //         ][Math.floor(Math.random() * 2)];
      //   const turnAction = { code: turnDir, indent: null };
      //   const turnWait = {
      //     code: Game_Character.ROUTE_WAIT,
      //     parameters: [+onTurnFlame],
      //     indent: null,
      //   };
      //   routeList = [
      //     ...routeList,
      //     turnWait,
      //     turnAction,
      //     turnWait,
      //     turnAction,
      //     turnWait,
      //   ];
      // }
      if (isThrough) {
        routeList = [
          { code: Game_Character.ROUTE_THROUGH_ON, indent: null },
          ...routeList,
          { code: Game_Character.ROUTE_THROUGH_OFF, indent: null },
        ];
      }
      if (isOneStep) {
        routeList = [
          ...routeList,
          { code: Game_Character.ROUTE_MOVE_FORWARD, indent: null },
        ];
      }
      if (endSwitchId) {
        routeList = [
          {
            code: Game_Character.ROUTE_SWITCH_OFF,
            parameters: [endSwitchId],
            indent: null,
          },
          ...routeList,
          {
            code: Game_Character.ROUTE_SWITCH_ON,
            parameters: [endSwitchId],
            indent: null,
          },
        ];
      }
      this._list = getInjectedListCommands(this._list, this._index, [
        {
          code: 205,
          indent: 0,
          parameters: [
            characterId,
            {
              list: [...routeList, { code: 0 }],
              // repeat: isRepeat,
              repeat: false,
              skippable: false,
              wait: wait === "true",
            },
          ],
        },
      ]);
    }
  );
  PluginManager.registerCommand(pluginName, "wait", function ({ endSwitch }) {
    const endSwitchId = +endSwitch;
    this._list = getInjectedListCommands(this._list, this._index, [
      { code: 112, indent: 0, parameters: [] },
      { code: 111, indent: 1, parameters: [0, endSwitchId, 0] },
      { code: 113, indent: 2, parameters: [] },
      { code: 0, indent: 2, parameters: [] },
      { code: 412, indent: 1, parameters: [] },
      { code: 230, indent: 1, parameters: [1] },
      { code: 0, indent: 1, parameters: [] },
      { code: 413, indent: 0, parameters: [] },
    ]);
  });
})();
