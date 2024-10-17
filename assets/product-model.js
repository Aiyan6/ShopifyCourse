class ProductModel extends HTMLElement {
  constructor() {
    super();
    this.openModalModal();
  }

  getMediaID() {
    const id = this.getAttribute("data-media-id");
    return id;
  }

  getModal() {
    const modal = document.getElementById("productModalModal");
    return modal;

  }

  openModalModal() {
    const mediaID = this.getMediaID();
    const modal = this.getModal();

    console.log(modal);
  }
}

const productModal = customElements.define("product-model", ProductModel);
