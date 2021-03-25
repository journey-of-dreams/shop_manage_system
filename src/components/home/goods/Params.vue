<template>
  <div id="params">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数!"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            :options="cateList"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  closable
                  @close="handleClose(index, scope.row)"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  >{{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  closable
                  @close="handleClose(index, scope.row)"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  >{{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数/静态属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParamsDialogVisible"
      width="30%"
      @close="addParamsDialogClosed"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改动态参数/静态属性对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editParamsDialogVisible"
      width="30%"
      @close="editParamsDialogClosed"
    >
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "params",
  components: {},
  data() {
    return {
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      //   级联选择框双向板绑定的数组
      selectedCateKeys: [],
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addParamsDialogVisible: false,
      addParamsForm: {
        attr_name: "",
      },
      addParamsFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      editParamsDialogVisible: false,
      editParamsForm: {},
      editParamsFormRules: {},
    };
  },
  mounted() {},
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data } = await this.$http.get("categories");
      if (data.meta.status !== 200) {
        return this.$message.error("获取分类数据失败");
      }
      this.cateList = data.data;
    },
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      const { data } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (data.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      data.data.forEach((item) => {
        item.attr_vals = item.attr_vals == "" ? [] : item.attr_vals.split(",");
        // 控制文本框的输入与隐藏
        item.inputVisible = false;
        // 文本框中输入的值
        item.inputValue = "";
      });
      console.log(data.data);
      if (this.activeName == "many") {
        this.manyTableData = data.data;
      } else {
        this.onlyTableData = data.data;
      }
    },
    // 级联选择框的值改变时触发
    handleChange() {
      this.getParamsData();
    },
    // tab标签改变时触发
    handleTabClick() {
      this.getParamsData();
    },
    // 添加参数对话框关闭时触发
    addParamsDialogClosed() {
      this.$refs.addParamsFormRef.resetFields();
    },
    // 点击按钮添加参数
    addParams() {
      this.$refs.addParamsFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (data.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.addParamsDialogVisible = false;
        this.getParamsData();
      });
    },
    // 点击按钮展示修改对话框
    async showEditDialog(attr_id) {
      const { data } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (data.meta.status !== 200) {
        return this.$message.error("查询参数信息失败");
      }
      this.editParamsForm = data.data;
      this.editParamsDialogVisible = true;
    },
    // 修改对话框关闭时触发
    editParamsDialogClosed() {
      this.$refs.editParamsFormRef.resetFields();
    },
    // 点击按钮修改参数
    editParams() {
      this.$refs.editParamsFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (data.meta.status !== 200) {
          return this.$message.error("查询参数信息失败");
        }
        this.editParamsDialogVisible = false;
        this.getParamsData();
      });
    },
    // 点击按钮删除参数
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("您已取消删除");
      } else {
        const { data } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${attr_id}`
        );
        if (data.meta.status !== 200) {
          return this.$message.error("删除参数失败");
        }
        this.$message.success("删除参数成功");
        this.getParamsData();
      }
    },
    // 将对attr_vals的操作保存到数据库
    async saveAttrVals(row) {
      const { data } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(","),
        }
      );
      if (data.meta.status !== 200) {
        return this.$message.error("修改参数项失败");
      }
    },
    // 添加新标签文本框失去焦点或按下回车键时触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length !== 0) {
        row.attr_vals.push(row.inputValue.trim());
        this.saveAttrVals(row);
      }
      row.inputValue = "";
      row.inputVisible = false;
    },
    // 按下添加新标签按钮时触发
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    // 点击删除一项tag标签
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row);
    },
  },
  computed: {
    //   按钮是否需要被禁用
    isBtnDisabled() {
      return this.selectedCateKeys.length == 3 ? false : true;
    },
    // 当前选中的三级分类id
    cateId() {
      return this.selectedCateKeys.length == 3
        ? this.selectedCateKeys[this.selectedCateKeys.length - 1]
        : null;
    },
    // 动态计算对话框变体文本
    titleText() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
  },
};
</script>

<style lang='less' scoped>
.el-cascader {
  margin: 15px 0;
}
.el-tag {
  margin-right: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>