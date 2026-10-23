#!/usr/bin/env node
/* 由正文文件的章题生成站点目录数据 _data/chapters.yml。
 * 用法：node tools/build-index.js      在仓库根执行
 * 新增或改章题后跑一次，再提交。 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "chapters");
const out = path.join(__dirname, "..", "_data", "chapters.yml");

const rows = fs.readdirSync(dir)
  .filter(f => /^\d{3}-.*\.md$/.test(f))
  .sort()
  .map(f => {
    const first = fs.readFileSync(path.join(dir, f), "utf8").split("\n")[0];
    const title = first.replace(/^#\s*/, "").trim();
    const num = parseInt(f.slice(0, 3), 10);
    const slug = f.replace(/\.md$/, "");
    return { num, title, url: "/chapters/" + slug + ".html" };
  });

fs.mkdirSync(path.dirname(out), { recursive: true });
let y = "# 由 tools/build-index.js 生成，别手改；新增章后重跑一次再提交。\n";
for (const r of rows) {
  y += "- num: " + r.num + "\n";
  y += '  title: "' + r.title + '"\n';
  y += '  url: "' + r.url + '"\n';
}
fs.writeFileSync(out, y);
console.log("写入 " + rows.length + " 章目录 → _data/chapters.yml");
