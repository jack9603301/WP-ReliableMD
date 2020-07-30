![image](https://cloud.githubusercontent.com/assets/389021/16107646/9729e556-33d8-11e6-933f-5b09fa3a53bb.png)

# GFM Markdown
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
$$f(x)=x^2$$ block

test$f_2(x)=2^{f(x)}$ inline

    code block
```js
console.log("fenced code block");
```
<pre>**HTML block**</pre>
* list
* list indented
1. ordered
2. list
1. ordered list
2. indented

- [ ] task
- [x] list completed

[link](https://nhnent.github.io/tui.editor/)
> block quote
---
horizontal line
***
`code`, *italic*, **bold**, ~~strikethrough~~, <span style="color:#e11d21">Red color</span>

# Table Cell Merge

| @cols=2:merged |
| --- | --- |
| table | table |

# Charts

```chart
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
```


# UML

```uml
class BaseClass

namespace net.dummy #DDDDDD {
.BaseClass <|-- Person
Meeting o-- Person

.BaseClass <|- Meeting
}

namespace net.foo {
net.dummy.Person  <|- Person
.BaseClass <|-- Person

net.dummy.Meeting o-- Person
}

BaseClass <|-- net.unused.Person
```
