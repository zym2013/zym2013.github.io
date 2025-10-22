var posts=["2025/10/09/amazing-luogu/","2025/10/09/bj-mstack/","2025/10/09/better-vjudge/","2025/10/09/hexofluid/","2025/10/09/tj-AT_abc174_d/","2025/10/09/tj-AT_abc177_c/","2025/10/09/tj-AT_arc196_a/","2025/10/09/tj-AT_cpsco2019_s1_d/","2025/10/09/tj-AT_iroha2019_day3_e/","2025/10/09/tj-SP9650/","2025/10/09/tj-AT_pakencamp_2020_day1_d/","2025/10/09/tj-UVA13291/","2025/05/09/tj-p3371/","2025/10/09/tj-p8794/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };var friend_link_list=[{"name":"Better Luogu","link":"https://blg.volatiles.dpdns.org/","avatar":"https://cdn.luogu.com.cn/upload/usericon/1416603.png","descr":"A script for Luogu"},{"name":"wbw121124","link":"https://wbwblog.github.io","avatar":"https://wbwblog.github.io/logo/logo/favicon.svg","descr":"wbw 巨大无比！","recommend":true},{"name":"joshua0729’s blog","link":"joshua0729’s blog","avater":"https://joshuajjm.github.io/img/icon.png","descr":"joshua0729的个人博客","recommend":true},{"name":"House Tsumugi","link":"https://blog.tsumugi.icu/","avatar":"埋骨何须桑梓地 , 人生无处不青山","descr":"Tsumugi 的博客","recommend":true},{"name":"Tsh's Blog","link":"https://tsh1203.github.io/","avatar":"https://tsh1203.github.io/images/logo/logo.webp","descr":"Tsh's Blog","recommend":true},{"name":"lijingshu`s blog","link":"https://lijingshu2014.github.io/","avatar":"https://lijingshu2014.github.io/img/avatar.png","descr":"lijingshu 的个人博客","recommend":true}];
    var refreshNum = 1;
    function friendChainRandomTransmission() {
      const randomIndex = Math.floor(Math.random() * friend_link_list.length);
      const { name, link } = friend_link_list.splice(randomIndex, 1)[0];
      Snackbar.show({
        text:
          "点击前往按钮进入随机一个友链，不保证跳转网站的安全性和可用性。本次随机到的是本站友链：「" + name + "」",
        duration: 8000,
        pos: "top-center",
        actionText: "前往",
        onActionClick: function (element) {
          element.style.opacity = 0;
          window.open(link, "_blank");
        },
      });
    }
    function addFriendLinksInFooter() {
      var footerRandomFriendsBtn = document.getElementById("footer-random-friends-btn");
      if(!footerRandomFriendsBtn) return;
      footerRandomFriendsBtn.style.opacity = "0.2";
      footerRandomFriendsBtn.style.transitionDuration = "0.3s";
      footerRandomFriendsBtn.style.transform = "rotate(" + 360 * refreshNum++ + "deg)";
      const finalLinkList = [];
  
      let count = 0;

      while (friend_link_list.length && count < 3) {
        const randomIndex = Math.floor(Math.random() * friend_link_list.length);
        const { name, link, avatar } = friend_link_list.splice(randomIndex, 1)[0];
  
        finalLinkList.push({
          name,
          link,
          avatar,
        });
        count++;
      }
  
      let html = finalLinkList
        .map(({ name, link }) => {
          const returnInfo = "<a class='footer-item' href='" + link + "' target='_blank' rel='noopener nofollow'>" + name + "</a>"
          return returnInfo;
        })
        .join("");
  
      html += "<a class='footer-item' href='/link/'>更多</a>";

      document.getElementById("friend-links-in-footer").innerHTML = html;

      setTimeout(()=>{
        footerRandomFriendsBtn.style.opacity = "1";
      }, 300)
    };