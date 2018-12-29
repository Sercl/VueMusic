# VueMusic音乐播放器


## 项目演示
![x](http://music.weixy666.cn/static/img/music.png)
###[演示地址](http://music.weixy666.cn "演示地址")

## 运行示例

``` bash
# 安装依赖
npm install

# 本地运行访问 http://127.0.0.1:8080
npm run dev

# 生产环境打包
npm run build

# 生产环境部署服务
npm run server
```

```
├─build //生产环境打包配置
├─buildback //升级webpack前备份
├─config //webpack配置
├─dist //打包后生产目录
├─src //源代码
│  ├─api //接口相关
│  │   config.js //接口公共配置
│  │   rank.js //排行榜相关接口
│  │   recommend.js //推荐页相关接口
│  │   search.js //搜索页相关接口
│  │   singer.js //歌手相关接口
│  │   song.js //歌曲相关接口
│  ├─base //基础组件
│  ├─common //公共资源
│  │  ├─fonts //字体图标资源
│  │  ├─image //静态图片
│  │  ├─js //公共js
│  │  │      cache.js //本地缓存相关
│  │  │      config.js //播放模式配置文件
│  │  │      dom.js //dom相关操作
│  │  │      jsonp.js //jsonp跨域
│  │  │      mixin.js //mixin混入
│  │  │      singer.js //歌手
│  │  │      song.js //歌曲数据实例化
│  │  │      uid.js //歌曲uid
│  │  │      util.js //公共工具
│  │  └─stylus //公共css样式
│  ├─components //业务组件
│  ├─router //路由
│  └─store //vuex
└─static //静态资源
```


