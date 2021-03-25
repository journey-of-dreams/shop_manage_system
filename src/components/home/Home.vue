<template>
  <div id="home">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img
            src="https://img.imgdb.cn/item/600913c83ffa7d37b3426967.jpg"
            alt=""
          />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主义区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="iscollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏菜单区域 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            :collapse="iscollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="index1 + ''"
              v-for="(item1, index1) in menuList"
              :key="item1.id"
            >
              <template slot="title">
                <i :class="iconList[index1]"></i>
                <span>{{ item1.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + item2.path"
                v-for="item2 in item1.children"
                :key="item2.id"
                @click="saveNavState('/' + item2.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ item2.authName }}</span>
                </template></el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容区域 -->
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
      menuList: [],
      iconList: [
        "iconfont icon-user",
        "iconfont icon-tijikongjian",
        "iconfont icon-shangpin",
        "iconfont icon-danju",
        "iconfont icon-baobiao",
      ],
      iscollapse: false,
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    // 退出
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 点击折叠面板
    toggleCollapse() {
      this.iscollapse = !this.iscollapse;
    },
    // 保存被点击链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
    // 获取所有菜单
    async getMenuList() {
      const { data } = await this.$http.get("menus");
      if (data.meta.status !== 200) {
        return this.$message.error(data.meta.msg);
      }
      this.menuList = data.data;
      console.log(data);
    },
  },
};
</script>

<style lang='less' scoped>
#home {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #fff;
        font-size: 20px;
        img {
          height: 80%;
          border-radius: 50%;
          margin-right: 15px;
        }
      }
      background: #373d41;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .el-container {
      .el-aside {
        background: #333744;
        .toggle-button {
          background: #4a5064;
          color: #fff;
          font-size: 10px;
          line-height: 24px;
          text-align: center;
          letter-spacing: 0.2em;
          cursor: pointer;
        }
        .el-menu {
          border: none;
          .iconfont {
            margin-right: 10px;
            font-size: 20px;
          }
        }
      }
      .el-main {
        background: #eaedf1;
      }
    }
  }
}
</style>