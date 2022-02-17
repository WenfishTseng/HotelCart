import productModal from "./productModal.js";

const site = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "yuritatest";

// form 驗證
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
// 因為只需要這幾個rules, 只用引入這4個
const { required, email, min, max } = VeeValidateRules;
// 引入多國語系的函式
const { localize, loadLocaleFromURL } = VeeValidateI18n;
defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

// 引入中文檔案
loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);
// 真正設定地方
configure({
  // 用來做一些設定
  generateMessage: localize("zh_TW"), //啟用 locale
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

const app = Vue.createApp({
  data() {
    return {
      // 購物車列表
      cartData: {},
      cartQty: 1,
      // 產品列表
      products: [],
      productId: "",
      // 局部讀取效果
      isLoadingItem: "",
      isCartLoadingItem: "",
      isDeleteLoadingItem: "",
      // 表單
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  methods: {
    getProducts() {
      axios
        .get(`${site}/api/${apiPath}/products/all`)
        .then((response) => {
          this.products = response.data.products;
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    openProductModal(id) {
      this.productId = id;
      this.isLoadingItem = id;
      setTimeout(() => {
        this.isLoadingItem = "";
      }, 800);
      this.$refs.productModal.openModal();
    },
    getCarts() {
      axios
        .get(`${site}/api/${apiPath}/cart`)
        .then((response) => {
          this.cartData = response.data.data;
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    addToCart(id, qty = 1) {
      // qty 預設 1
      const data = {
        data: {
          product_id: id,
          qty: qty,
        },
      };
      this.isCartLoadingItem = id;
      axios
        .post(`${site}/api/${apiPath}/cart`, data)
        .then((response) => {
          this.cartData = response.data.data;
          this.getCarts();
          // 讀完清空id
          this.isCartLoadingItem = "";
          // 關掉 modal
          this.$refs.productModal.closeModal();
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    // 更新購物車內的數量
    updateCart(item) {
      const data = {
        data: {
          product_id: item.id,
          qty: item.qty,
        },
      };
      this.isCartLoadingItem = item.id;
      axios
        .put(`${site}/api/${apiPath}/cart/${item.id}`, data)
        .then((response) => {
          this.getCarts();
          this.isCartLoadingItem = "";
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    removeCartItem(id) {
      this.isDeleteLoadingItem = id;
      axios
        .delete(`${site}/api/${apiPath}/cart/${id}`)
        .then((response) => {
          this.getCarts();
          // 讀完清空id
          this.isDeleteLoadingItem = "";
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    removeAllCarts() {
      axios
        .delete(`${site}/api/${apiPath}/carts`)
        .then((response) => {
          this.getCarts();
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    // 提交表單
    createOrder() {
      const url = `${site}/api/${apiPath}/order`;
      const order = this.form;
      axios
        .post(url, { data: order })
        .then((response) => {
          alert(response.data.message);
          this.$refs.form.resetForm();
          this.getCarts();
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    isFormPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "需要正確的電話號碼";
    },
  },
  mounted() {
    this.getProducts();
    this.getCarts();
  },
});

app.component("VForm", Form);
app.component("VField", Field);
app.component("ErrorMessage", ErrorMessage);

// 註冊打開單一產品視窗
// 拆分元件 js 檔
app.component("product-modal", productModal);

app.mount("#app");
