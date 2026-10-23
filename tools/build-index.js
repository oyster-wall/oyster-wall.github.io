#!/usr/bin/env node
/* 由正文文件首行的章题生成站点目录数据 _data/chapters.yml。
 * 用法：node tools/build-index.js      在仓库根执行
 * 正文按卷放在 chapters/卷一、chapters/卷二 下，本脚本递归扫，卷名取自目录名。
 * 新增章、改章题或换卷目录后跑一次，再提交。 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "chapters");
const out = path.join(__dirname, "..", "_data", "chapters.yml");

/* 卷目录名 → 卷题。开新卷时在 设定/分卷大纲.md 定名后，这里补一行。 */
const volLabels = {
  "卷一": "两份饭",
  "卷二": "黑色蔷薇"
};

function walk(root) {
  const list = [];
  for (const e of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, e.name);
    if (e.isDirectory()) list.push(...walk(full));
    else if (/^\d{3}-.*\.md$/.test(e.name)) list.push(full);
  }
  return list.sort();
}

const rows = walk(dir).map(full => {
  const first = fs.readFileSync(full, "utf8").split("\n")[0];
  const rel = path.relative(dir, full).split(path.sep);
  const vol = rel.length > 1 ? rel[0] : "";
  return {
    num: parseInt(path.basename(full).slice(0, 3), 10),
    title: first.replace(/^#\s*/, "").trim(),
    vol: vol,
    volLabel: volLabels[vol] || "",
    url: "/chapters/" + rel.join("/") .replace(/\.md$/, ".html")
  };
});

const missing = [...new Set(rows.filter(r => r.vol && !r.volLabel).map(r => r.vol))];
if (missing.length) {
  console.log("提醒：这些卷目录还没有卷题，去 tools/build-index.js 的 volLabels 补一行：" + missing.join("、"));
}

fs.mkdirSync(path.dirname(out), { recursive: true });
let y = "# 由 tools/build-index.js 生成，别手改；新增章、改章题或换卷目录后重跑一次再提交。\n";
for (const r of rows) {
  y += "- num: " + r.num + "\n";
  y += '  vol: "' + r.vol + '"\n';
  y += '  volLabel: "' + r.volLabel + '"\n';
  y += '  title: "' + r.title + '"\n';
  y += '  url: "' + r.url + '"\n';
}
fs.writeFileSync(out, y);

const vols = {};
for (const r of rows) vols[r.vol] = (vols[r.vol] || 0) + 1;
console.log("写入 " + rows.length + " 章目录 → _data/chapters.yml");
for (const v of Object.keys(vols)) console.log("  " + (v || "（无卷目录）") + " " + vols[v] + " 章");
