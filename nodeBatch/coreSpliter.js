// コアスクリプトをクラス毎に分割出力するバッチ
//
// 必須: Node.js
// 1. game.rmmzproject と同じディレクトリにこの JS を置く
// 2. このディレクトリ指定でターミナルを開き node coreSpliter.js を実行
// 3. js/src/ にコアスクリプトが展開されたことを確認する
// 4. index.html の js/main.js を js/src/main.js に変更

const fs = require("fs");
const delimit =
  "//-----------------------------------------------------------------------------";
const UTF8 = { encoding: "utf8" };
const mkdirp = (path) => fs.existsSync(path) || fs.mkdirSync(path);

const list = [
  "core",
  "managers",
  "objects",
  "scenes",
  "sprites",
  "windows",
].map((coreName) => ({
  coreName,
  files: fs
    .readFileSync(`./js/rmmz_${coreName}.js`, UTF8)
    .split(delimit)
    .map((code) => ({
      code,
      className:
        code.match(/^function ([\s\S]*?)\(\) {\n/m)?.[1] ||
        code.match("@namespace (JsExtensions)")?.[1],
    }))
    .filter(({ className }) => className),
}));

const mainJs = fs.readFileSync("./js/main.js", UTF8);

mkdirp("./js/src");

let alterMainJs = mainJs;
list.forEach(({ coreName, files }) => {
  let filenames = [];
  files.forEach(({ code, className }) => {
    filenames.push(`"js/src/${coreName}/${className}.js"`);
    mkdirp(`./js/src/${coreName}`);
    fs.writeFileSync(`./js/src/${coreName}/${className}.js`, code);
  });
  alterMainJs = alterMainJs.replace(
    `"js/rmmz_${coreName}.js"`,
    filenames.join(",\n    ")
  );
});
fs.writeFileSync(`./js/src/main.js`, alterMainJs);
