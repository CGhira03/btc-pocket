<template>
      <header class="principal-header">
        <button @click="goBack" class="btnGoBack">Volver Inicio</button>
        <img src="@/assets/logo3.png" alt="" class="transactions-logo">
      </header>
      <section class="crypto-transaction">
        <h2 class="transaction-title">Transacciones de Criptomonedas</h2>
    
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <div class="transaction-section">
          <!-- Formulario de Compra -->
          <div class="transaction-form-container">
            <h3 style="color: #ffffff;">Nueva Compra</h3>
            <form @submit.prevent="submitPurchase" class="transaction-form">
              <label for="crypto-buy">Criptomoneda:</label>
              <select id="crypto-buy" v-model="purchase.cryptoCode" @change="updateBuyMoney" required>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT">USDC</option>
                <option value="DAI">DAI</option>
                <option value="SOL">SOL</option>
              </select>
    
              <div class="input-group">
                <label>Monto a Comprar (ARS):</label>
                <input
                  type="number"
                  v-model.number="purchase.amount"
                  @input="updateBuyTotal"
                  required
                  min="0.001"
                />
              </div>
    
              <p>Precio unitario (ARS): {{ purchase.money.toFixed(2) }}</p>
              <p>Total a pagar: {{ calculateBuyTotal().toFixed(2) }} ARS</p>
              <button type="submit" :disabled="!canPurchase">Comprar</button>
            </form>
          </div>
    
          <!-- Formulario de Venta -->
          <div class="transaction-form-container">
            <h3 style="color: #ffffff;">Nueva Venta</h3>
            <form @submit.prevent="submitSale" class="transaction-form">
              <label for="crypto-sell">Criptomoneda:</label>
              <select id="crypto-sell" v-model="sale.cryptoCode" @change="updateSellMoney" required>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT">USDC</option>
                <option value="DAI">DAI</option>
                <option value="SOL">SOL</option>
              </select>
    
              <div class="input-group">
                <label>Monto a vender:</label>
                <input
                  type="number"
                  v-model.number="sale.amount"
                  @input="updateSellTotal"
                  required
                  min="0.001"
                />
              </div>
    
              <p>Precio unitario (ARS): {{ sale.money.toFixed(2) }}</p>
              <p>Total a recibir: {{ calculateSellTotal().toFixed(2) }} ARS</p>
              <button type="submit" :disabled="!canSell">Vender</button>
            </form>
          </div>
        </div>
    
      </section>
      
  </template>
  
  <script>
  import { useRouter } from "vue-router";
  import { ref } from "vue";
  import { getCryptoPrice, createTransaction } from "@/services/api"; 
  
  export default {
    setup() {
      const router = useRouter();
      const goBack = () => router.push("/principal");
  
      const purchase = ref({
        cryptoCode: "",
        amount: 0,
        money: 0,
      });
  
      const sale = ref({
        cryptoCode: "",
        amount: 0,
        money: 0,
      });
  
      const successMessage = ref("");
      const errorMessage = ref("");
  
      const canPurchase = () =>
        purchase.value.cryptoCode &&
        purchase.value.amount > 0 &&
        purchase.value.money > 0;
  
      const canSell = () =>
        sale.value.cryptoCode && sale.value.amount > 0 && sale.value.money > 0;
  
      const calculateBuyTotal = () => purchase.value.amount * purchase.value.money;
      const calculateSellTotal = () => sale.value.amount * sale.value.money;
  
      const updateBuyMoney = async () => {
        try {
          const money = await getCryptoPrice(purchase.value.cryptoCode); 
          purchase.value.money = money;
        } catch (error) {
          errorMessage.value = error.message; 
        }
      };
  
      const updateSellMoney = async () => {
        try {
          const money = await getCryptoPrice(sale.value.cryptoCode); 
          sale.value.money = money;
        } catch (error) {
          errorMessage.value = error.message;
        }
      };
  
      const submitPurchase = async () => {
        try {
          const payload = {
            user_id: localStorage.getItem("user_id"),
            action: "purchase",
            crypto_code: purchase.value.cryptoCode,
            crypto_amount: purchase.value.amount,
            money: purchase.value.money,
            datetime: new Date().toISOString(),
          };
  
          await createTransaction(payload);
          successMessage.value = "¡Compra registrada con éxito!";
          errorMessage.value = "";
          clearPurchaseForm();
        } catch (error) {
          successMessage.value = "";
          errorMessage.value = "Error al registrar la compra.";
        }
      };
  
      const submitSale = async () => {
        try {
          const payload = {
            user_id: localStorage.getItem("user_id"),
            action: "sale",
            crypto_code: sale.value.cryptoCode,
            crypto_amount: sale.value.amount,
            money: sale.value.money,
            datetime: new Date().toISOString(),
          };
  
          await createTransaction(payload);
          successMessage.value = "¡Venta registrada con éxito!";
          errorMessage.value = "";
          clearSaleForm();
        } catch (error) {
          successMessage.value = "";
          errorMessage.value = "Error al registrar la venta.";
        }
      };
  
      const clearPurchaseForm = () => {
        purchase.value.cryptoCode = "";
        purchase.value.amount = 0;
        purchase.value.money = 0;
      };
  
      const clearSaleForm = () => {
        sale.value.cryptoCode = "";
        sale.value.amount = 0;
        sale.value.money = 0;
      };
  
      return {
        goBack,
        purchase,
        sale,
        successMessage,
        errorMessage,
        canPurchase,
        canSell,
        calculateBuyTotal,
        calculateSellTotal,
        submitPurchase,
        submitSale,
        updateBuyMoney,
        updateSellMoney,
      };
    },
  };
  </script>
  
 
    