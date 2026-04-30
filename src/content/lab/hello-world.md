---
title: "Hello World!"
shortDesc: "Hello World!"
fullDesc: |
  Hello World!
  
  ## 1

  $E=mc^2$
createdAt: 2024-01-15
updatedAt: 2024-04-20
tags: ["Test", "测试"]
category: "测试"
keywords: ["Test", "测试"]
links:
  - name: "GitHub"
    url: "https://github.com/zym2013/"
  - name: "xxx"
    url: "xxx"
draft: false
---

# 欢迎使用 zym2013 的博客

呃呃呃，还有亿亿亿点东西没写完。

这是一个支持 **Markdown**、$\LaTeX$ 公式和代码高亮的博客系统。

## 1. 数学公式 (KaTeX)

行内公式：$E = mc^2$

块级公式：
$$
\int_{a}^{b} f(x) dx = F(b) - F(a)
$$

矩阵示例：
$$
\begin{pmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{pmatrix}
$$

## 2. 代码高亮 (Shiki)

```python
def hello_world():
    print("Hello, zym2013!")
    return True
```

```js
console.log('Normal') // [!code highlight]
throw new Error('Bug!') // [!code error]
console.warn('Careful') // [!code warning]
console.log('OK')
```

```js
console.log('OK')
console.log('Focused') // [!code focus]
```

<div class="vp-code-group" data-tabs='["config.js", "config.ts", "package.json"]'>

```js [config.js]
export default {
  port: 3000
}
```

```ts [config.ts]
export default {
  port: 3000
}
```

```json [package.json]
{
  "name": "test"
}
```

</div>

```cpp
# include <bits/stdc++.h>
# define ny(x) q_pow((x) , p - 2 , p)
using namespace std;
typedef long long LL;
LL x , y , a , b;
int p;
unordered_map <LL , LL> mp;
LL q_pow(LL x , LL y , int p)
{
	LL res = 1;
	while(y)
	{
		if(y & 1) (res *= x) %= p;
		(x *= x) %= p;
		y >>= 1;
	}
	return res;
}
LL exgcd(LL a , LL b , LL& x , LL& y)
{
	if(!b) return x = 1 , y = 0 , a;
	LL g = exgcd(b , a % b , y , x);
	y -= a / b * x;
	return g;
}
LL BSGS(LL a , LL b , int p)
{
    b %= p;
    if(b == 1) return 0;
    mp.clear() , mp[b] = 0;
    LL hl = sqrt(p) + 1;
    for(int i = 1 ; i < hl ; i ++) mp[(b *= a) %= p] = i;
    b = 1;
    for(int i = 1 ; i <= hl ; i ++) (b *= a) %= p;
    LL n = 1;
    for(int i = 1 ; i <= hl ; i ++)
    {
        if(mp.count((n *= b) %= p)) return i * hl - mp[n];
    }
    return -1;
}
LL exBSGS(LL a , LL b , int p)
{
    a %= p , b %= p;
    if(b == 1 || p == 1) return 0;
    LL g = __gcd(a , (LL)p) , A = 1 , cnt = 0;
    while(g > 1)
    {
        if(b % g) return -1;
        cnt ++;
        b /= g , p /= g , A = A * a / g % p;
        if(A == b) return cnt;
        g = __gcd(a , (LL)p);
    }
    exgcd(A , p , x , y);
    x = (x + p) % p;
    (b *= x) %= p;
    LL req = BSGS(a , b , p);
    return (req < 0 ? -1 : req + cnt);
}
void solve()
{
    if(!a && !b && !p) return ;
    LL req = exBSGS(a , b , p);
    if(req < 0) cout << "No Solution\n";
    else cout << req << "\n";
    return ;
}
int main()
{
    int t = 1;
    while(cin >> a >> p >> b) solve();
    return 0;
}
```

<span class="Badge tip">NEW</span> 这是一个新功能

<span class="Badge warning">BETA</span> 测试版