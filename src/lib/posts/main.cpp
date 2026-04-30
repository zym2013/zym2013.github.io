# include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef long double LD;
const LD eps = 1e-7;
const int N = 1e5 + 10;
LL n , m , k;
int fa[N];
LD v[N] , w[N] , t[N];
vector<LL> g[N];
int find(int x)
{
    return fa[x] == x ? x : fa[x] = find(fa[x]);
}
bool check(LD mid)
{
    vector <LD> b(n);
    vector <int> t;
    int vis[N] = {0};
    LD maxn[N];
    for(int i = 1 ; i <= n ; i ++)
    {
        int r = find(i);
        if(!vis[r])
        {
            vis[r] = 1;
            t.push_back(r);
            maxn[r] = -1e18;
        }
        LD val = v[i] - w[i] * mid;
        if(val > maxn[r]) maxn[r] = val;
    }
    if((LL)t.size() < k) 
    {
        for(int r : t) vis[r] = 0;
        return false;
    }
    b.resize(t.size());
    for(int i = 0 ; i < (LL)t.size() ; i ++)
    {
        b[i] = maxn[t[i]];
        vis[t[i]] = 0;
    }
    sort(b.begin() , b.end() , [](LD x , LD y)
    {
        return x > y;
    });
    LD sum = 0;
    for(int i = 0 ; i < k ; i ++) sum += b[i];
    return sum >= eps;
}
void solve()
{
    cin >> n >> m >> k;
    for(int i = 1 ; i <= n ; i ++) cin >> v[i] , fa[i] = i;
    for(int i = 1 ; i <= n ; i ++) cin >> w[i];
    for(int i = 1 , u , v ; i <= m ; i ++)
    {
        cin >> u >> v;
        
    }
    LD l = 0 , r = 100 , mid;
    while(r - l > eps)
    {
        mid = (l + r) / (LD)2;
        if(check(mid)) l = mid;
        else r = mid;
    }
    cout << (LL)(l + 0.5);
    return ;
}
int main()
{
    int t = 1;
    // cin >> t;
    while(t --) solve();
    return 0;
}