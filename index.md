---
layout: default
---

# 二创长编 · 蛎墙 · 应声

一部 200 章十二卷的中文长篇。故事发生在一面会数日子的蚝壳墙下：安魂粉按册发放，死可以分期，只有「为什么」仍然没人回答。卷一叫《两份饭》，卷二叫《黑色蔷薇》。

阅读顺序就是从 001 往下读，不需要先了解任何别的东西。每一章四到五节，八到十分钟读完。

{% assign ch = site.data.chapters %}

<div class="note">目前收录 {{ ch | size }} 章：卷一 001 至 017 已完稿，卷二从 018 起在写，写到第 {{ ch.last.num }} 章。</div>

## 卷一 · 两份饭 {: #vol-1}

<ul class="toc">
{%- for c in ch -%}
{%- if c.num <= 17 -%}
  <li><span class="n">{{ c.num }}</span><a href="{{ c.url | relative_url }}">{{ c.title }}</a></li>
{%- endif -%}
{%- endfor -%}
</ul>

## 卷二 · 黑色蔷薇 {: #vol-2}

<ul class="toc">
{%- for c in ch -%}
{%- if c.num >= 18 -%}
  <li><span class="n">{{ c.num }}</span><a href="{{ c.url | relative_url }}">{{ c.title }}</a></li>
{%- endif -%}
{%- endfor -%}
</ul>

## 凡例

叙事是第三人称限知，一章只跟一个人。设定不解释，只通过物件、数目和动作露出来。日子不写公历，按水汛与墙响算：一夜两阵，响满落一道杠。名词写法以 [设定/世界观](设定/世界观.html) 为准，连续性事实以 [设定/状态表](设定/状态表.html) 为准。全篇凡例见 [这里](about.html)。
