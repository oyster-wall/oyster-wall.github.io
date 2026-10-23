#!/usr/bin/env node
/* 章节机械核验。只读，不改任何文件。
 * 用法：node tools/check-chapters.js            全书扫描
 *       node tools/check-chapters.js 014       只查某一章（仍与其余章节比对重复句）
 * 退出码：0 干净，1 有超标项（字数越界、禁词命中、拉丁残留）。跨章重复句只报不判，需人判断是否刻意复现。
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "chapters");
const only = process.argv[2];

const wordLimit = [2800, 3500];

const bannedWords = [
  "没问题",
  "其实",
  "感觉",
  "有点",
  "然后就是",
  "你要明白",
  "换句话说"
];

/* 这些词在章节里出现就值得看一眼：多数是代理把设定拿出来解释的征兆。
 * 注意误报：安置、仪杖、名册是术语表里允许使用的具体词，命中不等于违规，必须读上下文。*/
const warnTerms = [
  "使者",
  "教会",
  "神庭",
  "公文",
  "轮回",
  "深渊",
  "名册",
  "安置",
  "仪杖",
  "沟底",
  "暗口",
  "堤下空"
];

const files = fs.readdirSync(dir).filter(f => f.endsWith(".md")).sort();
const texts = {};
for (const f of files) {
  texts[f] = fs.readFileSync(path.join(dir, f), "utf8");
}

let bad = 0;

for (const f of files) {
  if (only && !f.startsWith(only)) {
    continue;
  }
  const t = texts[f];
  const han = (t.match(/[一-鿿]/g) || []).length;
  const sections = (t.match(/^## /gm) || []).length;
  const latin = (t.match(/[A-Za-z]{2,}/g) || []).join(",");
  const hits = bannedWords.filter(w => t.includes(w));
  const warns = warnTerms.filter(w => t.includes(w));
  const firstLine = t.split("\n")[0].replace(/^#\s*/, "");

  const cross = [];
  const norm = t.replace(/\s/g, "");
  for (const g of files) {
    if (g === f) {
      continue;
    }
    const other = g.startsWith(only) ? norm : texts[g].replace(/\s/g, "");
    const source = g.startsWith(only) ? texts[g].replace(/\s/g, "") : norm;
    for (const s of source.split(/[。！？]/).filter(x => x.length > 14)) {
      if (other.includes(s)) {
        cross.push(g + " :: " + s.slice(0, 18));
      }
    }
  }

  const over = han < wordLimit[0] || han > wordLimit[1];
  if (over || hits.length || latin) {
    bad++;
  }

  console.log(f.replace(".md", ""));
  console.log("  标题：" + firstLine);
  console.log("  汉字：" + han + (over ? "  ← 超出 2800 到 3500" : "  区间内") + "，节：" + sections);
  console.log("  禁用词：" + (hits.join("、") || "无") + "，拉丁残留：" + (latin || "无"));
  console.log("  需读上下文的术语命中：" + (warns.join("、") || "无"));
  console.log("  跨章同句（>14 字）：" + (cross.length ? cross.join("\n    ") : "无"));
}

let total = 0;
for (const f of files) {
  total += ((texts[f].match(/[一-鿿]/g) || []).length);
}
console.log("");
console.log("章数：" + files.length + "，全书汉字：" + total + "，问题章数：" + bad);
process.exit(bad ? 1 : 0);
