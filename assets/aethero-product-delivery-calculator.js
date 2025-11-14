/**
 * Product Delivery Calculator
 * Calculates delivery cost based on product weight and quantity
 * Shows 0 if total weight > 5kg, otherwise shows standard delivery cost
 */
class ProductDeliveryCalculator {
  constructor() {
    this.deliveryElement = document.getElementById('delivery-cost');
    if (!this.deliveryElement) return;

    this.deliveryValueElement = this.deliveryElement.querySelector('.delivery-cost-value');
    if (!this.deliveryValueElement) return;

    this.deliveryFree = parseInt(this.deliveryElement.dataset.deliveryFree || '0', 10);
    this.deliveryStandard = parseInt(this.deliveryElement.dataset.deliveryStandard || '800', 10);
    this.weightThreshold = parseInt(this.deliveryElement.dataset.weightThreshold || '5000', 10);

    this.currentVariantId = null;
    this.currentQuantity = 1;
    this.variantsData = window.productDeliveryData?.variants || [];

    this.init();
  }

  init() {
    // Get initial variant ID from the form
    const variantInput = document.querySelector('form.js-product-form input[name="id"]');
    if (variantInput) {
      this.currentVariantId = parseInt(variantInput.value, 10);
    }

    // Get initial quantity
    const quantityInput = document.querySelector('quantity-input .qty-input__input');
    if (quantityInput) {
      this.currentQuantity = parseInt(quantityInput.value || '1', 10);
      // Listen for both change and input events for better responsiveness
      quantityInput.addEventListener('change', this.handleQuantityChange.bind(this));
      quantityInput.addEventListener('input', this.handleQuantityChange.bind(this));
    } else {
      // If no quantity selector, quantity is always 1
      this.currentQuantity = 1;
    }

    // Listen for variant changes
    document.addEventListener('on:variant:change', this.handleVariantChange.bind(this));

    // Calculate initial delivery cost
    this.updateDeliveryCost();
  }

  /**
   * Handles quantity input changes
   */
  handleQuantityChange(evt) {
    this.currentQuantity = parseInt(evt.target.value || '1', 10);
    this.updateDeliveryCost();
  }

  /**
   * Handles variant changes
   * @param {Event} evt - Variant change event
   */
  handleVariantChange(evt) {
    if (evt.detail && evt.detail.variant) {
      this.currentVariantId = evt.detail.variant.id;
      this.updateDeliveryCost();
    }
  }

  /**
   * Gets the weight for the current variant
   * @returns {number} Weight in grams
   */
  getCurrentVariantWeight() {
    if (!this.currentVariantId || !this.variantsData.length) {
      return 0;
    }

    const variant = this.variantsData.find(v => v.id === this.currentVariantId);
    return variant ? variant.weight : 0;
  }

  /**
   * Calculates total weight based on quantity
   * @returns {number} Total weight in grams
   */
  getTotalWeight() {
    const variantWeight = this.getCurrentVariantWeight();
    return variantWeight * this.currentQuantity;
  }

  /**
   * Gets the formatted delivery cost based on total weight
   * @returns {string} Formatted delivery cost string
   */
  getFormattedDeliveryCost() {
    const totalWeight = this.getTotalWeight();
    const isFree = totalWeight > this.weightThreshold;
    
    // Use pre-formatted values from data attributes
    const formattedFree = this.deliveryElement.dataset.deliveryFreeFormatted || '0,00 €';
    const formattedStandard = this.deliveryElement.dataset.deliveryStandardFormatted || '8,00 €';
    
    return isFree ? formattedFree : formattedStandard;
  }

  /**
   * Updates the delivery cost display
   */
  updateDeliveryCost() {
    const formattedCost = this.getFormattedDeliveryCost();
    
    // Update the display
    if (this.deliveryValueElement) {
      this.deliveryValueElement.textContent = `Doručenie: ${formattedCost}`;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ProductDeliveryCalculator();
  });
} else {
  new ProductDeliveryCalculator();
}

