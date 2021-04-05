<template>
  <div id="order">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" clearable @clear="getOrderList"
            ><el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="80px"
        ></el-table-column>
        <el-table-column label="是否付款" width="80px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">
              已付款
            </el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" width="80px">
          <template slot-scope="scope">
            <p v-if="scope.row.is_send">是</p>
            <p v-else>否</p>
          </template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="修改地址"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                circle
                @click="showBox"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="物流详情"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                size="mini"
                icon="el-icon-location"
                circle
                @click="showProgressBox"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="30%"
      @close="addressDialogClosed"
    >
      <el-form
        ref="addressFormRef"
        :model="addressForm"
        :rules="addressFormRules"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 显示物流详情对话框 -->
    <el-dialog title="物流详情" :visible.sync="progressVisible" width="30%">
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata";

export default {
  name: "order",
  components: {},
  data() {
    return {
      queryInfo: { query: "", pagenum: 1, pagesize: 10 },
      total: 0,
      orderList: [],
      addressVisible: false,
      addressForm: {
        address1: "",
        address2: "",
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      cityData: cityData,
      progressVisible: false,
      progressInfo:[]
    };
  },
  mounted() {},
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (data.meta.status !== 200) {
        return this.$message.error("获取订单数据列表失败");
      }
      this.orderList = data.data.goods;
      this.total = data.data.total;
    },
    // 页容量改变时触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    // 当前页码改变时触发
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 显示修改地址对话框
    showBox() {
      this.addressVisible = true;
    },
    // 修改地址对话框关闭时触发
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    // 显示物流详情对话框
    async showProgressBox() {
      const { data } = await this.$http.get("/kuaidi/1106975712662");
      if (data.meta.status !== 200) {
        return this.$message.error("获取物流详情失败");
      }
      this.progressInfo = data.data;
      this.progressVisible = true;
    },
  },
};
</script>

<style lang='less' scoped>
.el-cascader {
  width: 100%;
}
</style>