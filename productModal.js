export default {
  template: `#userProductModal`,
  props: ["pid"],
  data() {
    return {
      myModal: "",
      product: {},
      qty: 1,
    };
  },
  watch: {
    // 當id變動 就更換資料畫面
    pid() {
      this.getSingleProduct();
    },
  },
  methods: {
    openModal() {
      this.myModal.show();
    },
    closeModal() {
      this.myModal.hide();
    },
    getSingleProduct() {
      const site = "https://vue3-course-api.hexschool.io/v2";
      const apiPath = "yuritatest";
      axios
        .get(`${site}/api/${apiPath}/product/${this.pid}`)
        .then((response) => {
          this.product = response.data.product;
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    // 將內層資料傳到外層購物車列表 emit
    addCartQty() {
      this.$emit("add-cart", this.product.id, this.qty);
    },
  },
  mounted() {
    this.myModal = new bootstrap.Modal(this.$refs.productModal);
  },
};
