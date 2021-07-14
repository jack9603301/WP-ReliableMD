---
title: WP-ReliableMD Demo
---

![image](https://cloud.githubusercontent.com/assets/389021/16107646/9729e556-33d8-11e6-933f-5b09fa3a53bb.png)

# GFM Markdown

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

$$latex
\documentclass{article}
\begin{document}

\begin{center}
\$ \& \% \# \_ \{ \} \~{} \^{} \textbackslash % \< \>  \"   % TODO cannot be typeset
\end{center}

\[
f(x) = \int_{-\infty}^\infty \hat f(\xi),e^{2 \pi i \xi x} , d\xi
\]

\(
f(x) = \int_{-\infty}^\infty \hat f(\xi),e^{2 \pi i \xi x} , d\xi
\)
\end{document}
$$

```
code block
```

```js
console.log(“fenced code block”);
```

**HTML block**

* list
* list indented

1. ordered
2. list
3. ordered list
4. indented

* [ ] task1
* [x] task2
* 222

[link](https://nhnent.github.io/tui.editor/)

> block quote
> —
> horizontal line

***

`code`, *italic*, **bold**, ~~strikethrough~~, Red color

# Hyperlink references author

author

$$widget0 (@jack9603301)$$ $$widget0 (@jack9603301)$$

 $$widget1 [@jack9603301](#)$$ $$widget1 [@jack9603301](#)$$ $$widget1 [@jack9603301](#)$$

# Color Syntax Plugin

<span style="color:#86c1b9">Click the color picker button on the toolbar!</span>

# Table Cell Merge

| @cols=2:merged |
| ------ | ------ |
| table | table2 |

# Charts

$$chart
, Seoul , Sydney , Moskva
Jan,20, 5, 30
Feb,40, 30, 5
Mar,25, 31, 18
Apr,50, 18, 21
May,15, 59, 33
June,45, 50, 41
July,33, 28, 29
Aug,34, 33, 15
Sep,20, 7, 30
Oct,30, 20, 10
Nov,22, 10, 33
Dec,13, 3, 5

type: area
title: 24-hr Average Temperature
width: 465
x.title: Month
y.title: Temperature (Celsius)
y.pointOnColumn: true
y.suffix: °C
tooltip.suffix:°C
legend.visible: true
$$

# UML

$$uml
partition Conductor {
  (*) --> "Climbs on Platform"
  --> === S1 ===
  --> Bows
}

partition Audience #LightSkyBlue {
  === S1 === --> Applauds
}

partition Conductor {
  Bows --> === S2 ===
  --> WavesArmes
  Applauds --> === S2 ===
}

partition Orchestra #CCCCEE {
  WavesArmes --> Introduction
  --> "Play music"
}
$$


