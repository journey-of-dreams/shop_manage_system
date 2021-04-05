<template>
  <div id="add">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tab栏区域 -->
        <el-tabs v-model="activeIndex" tab-position="left">
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-row>
              <el-col :span="6" :offset="9">
                <el-button type="primary" round class="nextBtn" @click="next"
                  >下一步</el-button
                >
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数" :disabled="arrDisabled[1]">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-row>
              <el-col :span="6" :offset="9">
                <el-button type="primary" round class="nextBtn" @click="next"
                  >下一步</el-button
                >
              </el-col>
            </el-row></el-tab-pane
          >
          <el-tab-pane name="2" label="商品属性" :disabled="arrDisabled[2]">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="6" :offset="9">
                <el-button type="primary" round class="nextBtn" @click="next"
                  >下一步</el-button
                >
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片" :disabled="arrDisabled[3]">
            <!-- action表示图片要上传到的后台API地址
                on-preview表示预览图片时触发
                on-remove表示图片移除时触发
                list-type表示图片预览效果 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
            <el-row>
              <el-col :span="6" :offset="9">
                <el-button type="primary" round class="nextBtn" @click="next"
                  >下一步</el-button
                >
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容" :disabled="arrDisabled[4]">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" style="margin-top: 15px" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="30%">
      <img :src="previewPath" class="previewImg" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "loadsh";
export default {
  name: "add",
  components: {},
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        // 商品所属的分类id数组
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品详情描述
        goods_introduce: "",
        attrs: [],
      },
      addFormRules: {
        goods_name: {
          required: true,
          message: "请输入商品名称",
          trigger: "blur",
        },
        goods_price: {
          required: true,
          message: "请输入商品价格",
          trigger: "blur",
        },
        goods_weight: {
          required: true,
          message: "请输入商品重量",
          trigger: "blur",
        },
        goods_number: {
          required: true,
          message: "请输入商品数量",
          trigger: "blur",
        },
        goods_cat: {
          required: true,
          message: "请选择商品分类",
          trigger: "blur",
        },
      },
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      arrDisabled: [false, true, true, true, true],
      arrProps: [
        "goods_name",
        "goods_price",
        "goods_weight",
        "goods_number",
        "goods_cat",
      ],
      manyTableData: [],
      onlyTableData: [],
      // 上传图片的url地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片上传组件headers的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewVisible: false,
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
        this.$message.error("获取商品分类数据失败");
      }
      this.cateList = data.data;
    },
    // 获取商品属性列表
    async getGoodsList(activeName) {
      const { data } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: activeName,
          },
        }
      );
      if (data.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      if (activeName == "many") {
        data.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals == "" ? [] : item.attr_vals.split(",");
        });
        this.manyTableData = data.data;
      } else {
        this.onlyTableData = data.data;
      }
    },
    // 级联选择器的值发生改变时触发
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 预览图片时触发
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 移除图片时触发
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => x.pic == filePath);
      this.addForm.pics.splice(i, 1);
    },
    // 图片上传成功触发
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },
    // 索引加一
    indexPlugOne() {
      this.activeIndex++;
      this.arrDisabled[this.activeIndex] = false;
      this.activeIndex = this.activeIndex + "";
    },
    // 点击按钮激活下一个tag
    async next() {
      if (this.activeIndex === "0") {
        this.$refs.addFormRef.validateField("goods_name", (valid) => {
          if (valid) {
            return this.$message.error("请先填写商品名称");
          }
          this.$refs.addFormRef.validateField("goods_price", (valid) => {
            if (valid) {
              return this.$message.error("请先填写商品价格");
            }
            this.$refs.addFormRef.validateField("goods_weight", (valid) => {
              if (valid) {
                return this.$message.error("请先填写商品重量");
              }
              this.$refs.addFormRef.validateField("goods_number", (valid) => {
                if (valid) {
                  return this.$message.error("请先填写商品数量");
                }
                this.$refs.addFormRef.validateField("goods_cat", (valid) => {
                  if (valid) {
                    return this.$message.error("请先填写商品分类");
                  }
                  this.getGoodsList("many");
                  this.indexPlugOne();
                });
              });
            });
          });
        });
      } else if (this.activeIndex === "1") {
        this.getGoodsList("only");
        this.indexPlugOne();
      } else {
        this.indexPlugOne();
      }
    },
    // 点击添加商品
    async add() {
      const form = _.cloneDeep(this.addForm);
      form.goods_cat = form.goods_cat.join(",");
      // 处理动态参数和静态属性
      this.manyTableData.forEach((item) => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(","),
        };
        this.addForm.attrs.push(newInfo);
      });
      this.onlyTableData.forEach((item) => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals,
        };
        this.addForm.attrs.push(newInfo);
      });
      form.attrs = this.addForm.attrs;
      const { data } = await this.$http.post("goods", form);
      if (data.meta.status !== 201) {
        return this.$message.error("添加商品失败");
      }
      this.$message.success("添加商品成功");
      this.$router.push("/goods");
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang='less' scoped>
.nextBtn {
  width: 180px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
</style>