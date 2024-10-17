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
    const modal = document.getElementById("productModelModal");
    return modal;
  }

  openModalModal() {
    const mediaID = this.getMediaID();
    const modal = this.getModal();

    if (!mediaID) return;
    const openModalButton = this.querySelector(
      `button[id=productModalOpenButton_${mediaID}`
    );

    openModalButton.addEventListener("click", function (e) {
      modal.querySelector("#body").innerHTML = "";
      const template = document.querySelector(`product-model[data-media-id=${mediaID }] > template`);
      console.log(template);
    });
  }
}

const productModal = customElements.define("product-model", ProductModel);
