<template>
  <div id="report">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!--2. 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echarts
import * as echarts from "echarts";
import _ from "loadsh";

export default {
  name: "report",
  components: {},
  data() {
    return {
      // 需要合并的配置项
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  async mounted() {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    // 4. 指定图表的配置项和数据
    const { data } = await this.$http.get("reports/type/1");
    if (data.meta.status !== 200) {
      return this.$message.error("获取折线图数据失败");
    }
    // merge合并两个对象
    const result = _.merge(data.data, this.options);
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  },
  methods: {},
};
</script>

<style lang='less' scoped>
</style>