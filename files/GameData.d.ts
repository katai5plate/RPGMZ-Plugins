// RPGツクールMZ の data/*.json 型定義

type X2<T> = [T, T];
type X4<T, L extends T[] = X2<T>> = [...L, ...L];
type X8<T, L extends T[] = X4<T>> = [...L, ...L];

type X5<T, L extends T[] = X4<T>> = [...L, T];
type X10<T, L extends T[] = X5<T>> = [...L, ...L];
type X20<T, L extends T[] = X10<T>> = [...L, ...L];
type X100<T, L extends T[] = X20<T>> = [...L, ...L, ...L, ...L, ...L];

type X6<T, L extends T[] = X5<T>> = [...L, T];
type X9<T, L extends T[] = X8<T>> = [...L, T];
type X13<T, L extends T[] = X10<T>> = [...L, ...X2<T>, T];
type X24<T, L extends T[] = X20<T>> = [...L, ...X4<T>];

type DBList<T> = [null, ...T[]];

type ExpParams = X4<number>;
type ColorTone = X4<number>;
type Equips = X5<number>;
type StateChangeParams = X8<number>;

interface Event {
  code: number;
  indent?: number;
  parameters: [];
}
type EventList = Event[];
interface Effect {
  code: number;
  dataId: number;
  value1: number;
  value2: number;
}
type Effects = Effect[];
interface Audio {
  name: string;
  pan: number;
  pitch: number;
  volume: number;
}
interface AttackMotion {
  type: number;
  weaponImageId: number;
}
interface Ship {
  bgm: Audio;
  characterIndex: number;
  characterName: string;
  startMapId: number;
  startX: number;
  startY: number;
}
interface Trait {
  code: number;
  dataId: number;
  value: number;
}
type Traits = Trait[];
export interface Actor {
  id: number;
  battlerName: string;
  characterIndex: number;
  characterName: string;
  classId: number;
  equips: Equips;
  faceIndex: number;
  faceName: string;
  traits: Traits;
  initialLevel: number;
  maxLevel: number;
  name: string;
  nickname: string;
  note: string;
  profile: string;
}
export type Actors = DBList<Actor>;
interface FlashTiming {
  frame: number;
  duration: number;
  color: ColorTone;
}
interface Vector3D {
  x: number;
  y: number;
  z: number;
}
interface soundTiming {
  frame: number;
  se: Audio;
}
export interface Animation {
  id: number;
  displayType: number;
  effectName: string;
  flashTimings: FlashTiming[];
  name: string;
  offsetX: number;
  offsetY: number;
  rotation: Vector3D;
  scale: number;
  soundTimings: soundTiming[];
  speed: number;
}
export type Animations = DBList<Animation>;
export interface Armore {
  id: number;
  atypeId: number;
  description: string;
  etypeId: number;
  traits: Traits;
  iconIndex: number;
  name: string;
  note: string;
  params: StateChangeParams;
  price: number;
}
export type Armores = DBList<Armore>;
interface Learning {
  level: number;
  skillId: number;
  note: string;
}
export interface Class {
  id: number;
  expParams: ExpParams;
  traits: Traits;
  learnings: Learning[];
  name: string;
  note: string;
  params: X8<X100<number>>;
}
export type Classes = DBList<Class>;
export interface CommonEvent {
  id: number;
  list: EventList;
  name: string;
  switchId: number;
  trigger: number;
}
export type CommonEvents = DBList<CommonEvent>;
interface DropItem {
  dataId: number;
  denominator: number;
  kind: number;
}
interface Action {
  conditionParam1: number;
  conditionParam2: number;
  conditionType: number;
  rating: number;
  skillId: number;
}
export interface Enemy {
  id: number;
  actions: Action[];
  battlerHue: number;
  battlerName: string;
  dropItems: DropItem[];
  exp: number;
  traits: Traits;
  gold: number;
  name: string;
  note: string;
  params: StateChangeParams;
}
export type Enemies = DBList<Enemy>;
interface Damage {
  critical: boolean;
  elementId: number;
  formula: string;
  type: number;
  variance: number;
}
export interface Item {
  id: number;
  animationId: number;
  consumable: boolean;
  damage: Damage;
  description: string;
  effects: Effects;
  hitType: number;
  iconIndex: number;
  itypeId: number;
  name: string;
  note: string;
  occasion: number;
  price: number;
  repeats: number;
  scope: number;
  speed: number;
  successRate: number;
  tpGain: number;
}
export type Items = DBList<Item>;
interface Encounter {
  troopId: number;
  weight: number;
  regionSet: number[];
}
export interface Map {
  autoplayBgm: boolean;
  autoplayBgs: boolean;
  battleback1Name: string;
  battleback2Name: string;
  bgm: Audio;
  bgs: Audio;
  disableDashing: boolean;
  displayName: string;
  encounterList: Encounter[];
  encounterStep: number;
  height: number;
  note: string;
  parallaxLoopX: boolean;
  parallaxLoopY: boolean;
  parallaxName: string;
  parallaxShow: boolean;
  parallaxSx: number;
  parallaxSy: number;
  scrollType: number;
  specifyBattleback: boolean;
  tilesetId: number;
  width: number;
  data: number[];
  events: DBList<MapEvent>;
}
interface MapEventCharactorImage {
  tileId: number;
  characterName: string;
  direction: number;
  pattern: number;
  characterIndex: number;
}
interface MapEventConditions {
  actorId: number;
  actorValid: boolean;
  itemId: number;
  itemValid: boolean;
  selfSwitchCh: string;
  selfSwitchValid: boolean;
  switch1Id: number;
  switch1Valid: boolean;
  switch2Id: number;
  switch2Valid: boolean;
  variableId: number;
  variableValid: boolean;
  variableValue: number;
}
interface MoveRoute {
  list: EventList;
  repeat: boolean;
  skippable: boolean;
  wait: boolean;
}
interface MapEventPage {
  conditions: MapEventConditions;
  directionFix: boolean;
  image: MapEventCharactorImage;
  list: EventList;
  moveFrequency: number;
  moveRoute: MoveRoute;
  moveSpeed: number;
  moveType: number;
  priorityType: number;
  stepAnime: boolean;
  through: boolean;
  trigger: number;
  walkAnime: boolean;
}
interface MapEvent {
  id: number;
  name: string;
  note: string;
  pages: MapEventPage[];
  x: number;
  y: number;
}
export interface MapInfo {
  id: number;
  expanded: boolean;
  name: string;
  order: number;
  parentId: number;
  scrollX: number;
  scrollY: number;
}
export type MapInfos = DBList<MapInfo>;
export interface Skill {
  id: number;
  animationId: number;
  damage: Damage;
  description: string;
  effects: Effects;
  hitType: number;
  iconIndex: number;
  message1: string;
  message2: string;
  mpCost: number;
  name: string;
  note: string;
  occasion: number;
  repeats: number;
  requiredWtypeId1: number;
  requiredWtypeId2: number;
  scope: number;
  speed: number;
  stypeId: number;
  successRate: number;
  tpCost: number;
  tpGain: number;
  messageType: number;
}
export type Skills = DBList<Skill>;
export interface State {
  id: number;
  autoRemovalTiming: number;
  chanceByDamage: number;
  traits: Traits;
  iconIndex: number;
  maxTurns: number;
  message1: string;
  message2: string;
  message3: string;
  message4: string;
  minTurns: number;
  motion: number;
  name: string;
  note: string;
  overlay: number;
  priority: number;
  removeAtBattleEnd: boolean;
  removeByDamage: boolean;
  removeByRestriction: boolean;
  removeByWalking: boolean;
  restriction: number;
  stepsToRemove: number;
}
export type States = DBList<State>;
interface AdvancedSettings {
  gameId: number;
  screenWidth: number;
  screenHeight: number;
  uiAreaWidth: number;
  uiAreaHeight: number;
  numberFontFilename: string;
  fallbackFonts: string;
  fontSize: number;
  mainFontFilename: string;
}
interface TermMessages {
  alwaysDash: string;
  commandRemember: string;
  touchUI: string;
  bgmVolume: string;
  bgsVolume: string;
  meVolume: string;
  seVolume: string;
  possession: string;
  expTotal: string;
  expNext: string;
  saveMessage: string;
  loadMessage: string;
  file: string;
  autosave: string;
  partyName: string;
  emerge: string;
  preemptive: string;
  surprise: string;
  escapeStart: string;
  escapeFailure: string;
  victory: string;
  defeat: string;
  obtainExp: string;
  obtainGold: string;
  obtainItem: string;
  levelUp: string;
  obtainSkill: string;
  useItem: string;
  criticalToEnemy: string;
  criticalToActor: string;
  actorDamage: string;
  actorRecovery: string;
  actorGain: string;
  actorLoss: string;
  actorDrain: string;
  actorNoDamage: string;
  actorNoHit: string;
  enemyDamage: string;
  enemyRecovery: string;
  enemyGain: string;
  enemyLoss: string;
  enemyDrain: string;
  enemyNoDamage: string;
  enemyNoHit: string;
  evasion: string;
  magicEvasion: string;
  magicReflection: string;
  counterAttack: string;
  substitute: string;
  buffAdd: string;
  debuffAdd: string;
  buffRemove: string;
  actionFailure: string;
}
interface Terms {
  basic: X10<string>;
  commands: [...X20<string>, null, ...X2<string>, null, ...X2<string>];
  params: X10<string>;
  messages: TermMessages;
}
interface TestBattler {
  actorId: number;
  level: number;
  equips: Equips;
}
interface TitleCommandWindow {
  background: number;
  offsetX: number;
  offsetY: number;
}
export interface System {
  advanced: AdvancedSettings;
  airship: Ship;
  armorTypes: string[];
  attackMotions: X13<AttackMotion>;
  battleBgm: Audio;
  battleback1Name: string;
  battleback2Name: string;
  battlerHue: number;
  battlerName: string;
  battleSystem: number;
  boat: Ship;
  currencyUnit: string;
  defeatMe: Audio;
  editMapId: number;
  elements: string[];
  equipTypes: string[];
  gameTitle: string;
  gameoverMe: Audio;
  itemCategories: X4<boolean>;
  locale: string;
  magicSkills: number[];
  menuCommands: X6<boolean>;
  optAutosave: boolean;
  optDisplayTp: boolean;
  optDrawTitle: boolean;
  optExtraExp: boolean;
  optFloorDeath: boolean;
  optFollowers: boolean;
  optKeyItemsNumber: boolean;
  optSideView: boolean;
  optSlipDeath: boolean;
  optTransparent: boolean;
  partyMembers: number[];
  ship: Ship;
  skillTypes: string[];
  sounds: X24<Audio>;
  startMapId: number;
  startX: number;
  startY: number;
  switches: string[];
  terms: Terms;
  testBattlers: TestBattler[];
  testTroopId: number;
  title1Name: string;
  title2Name: string;
  titleBgm: Audio;
  titleCommandWindow: TitleCommandWindow;
  variables: string[];
  versionId: number;
  victoryMe: Audio;
  weaponTypes: string[];
  windowTone: ColorTone;
}
export interface Tileset {
  id: number;
  flags: number[];
  mode: number;
  name: string;
  note: string;
  tilesetNames: X9<string>;
}
export type Tilesets = DBList<Tileset>;
interface TroopMember {
  enemyId: number;
  x: number;
  y: number;
  hidden: boolean;
}
interface TroopPage {
  conditions: TroopPageConditions;
  list: EventList;
  span: number;
}
interface TroopPageConditions {
  actorHp: number;
  actorId: number;
  actorValid: boolean;
  enemyHp: number;
  enemyIndex: number;
  enemyValid: boolean;
  switchId: number;
  switchValid: boolean;
  turnA: number;
  turnB: number;
  turnEnding: boolean;
  turnValid: boolean;
}
export interface Troop {
  id: number;
  members: TroopMember[];
  name: string;
  pages: TroopPage[];
}
export type Troops = DBList<Troop>;
export interface Weapon {
  id: number;
  animationId: number;
  description: string;
  etypeId: number;
  traits: Traits;
  iconIndex: number;
  name: string;
  note: string;
  params: StateChangeParams;
  price: number;
  wtypeId: number;
}
export type Weapons = DBList<Weapon>;
