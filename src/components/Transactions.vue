<template>
    <div class="crypto-transaction">
      <header>
        <button @click="goBack" class="btnGoBack">Volver Inicio</button>
        <img src="@/assets/logo.png" alt="Logo" />
      </header>
  
      <h2>Transacciones de Criptomonedas</h2>
  
      <div class="transaction-section">
        <!-- Formulario de Compra -->
        <div class="form-container">
          <h3>Nueva Compra</h3>
          <form @submit.prevent="submitPurchase">
            <label for="crypto-buy">Criptomoneda:</label>
            <select id="crypto-buy" v-model="purchase.cryptoCode" @change="updateBuyMoney" required>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">USDC</option>
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
        <div class="form-container">
          <h3>Nueva Venta</h3>
          <form @submit.prevent="submitSale">
            <label for="crypto-sell">Criptomoneda:</label>
            <select id="crypto-sell" v-model="sale.cryptoCode" @change="updateSellMoney" required>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">USDC</option>
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
  
      <!-- Mensajes de éxito o error -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
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
  
  
  <style scoped>
  header{
    background-color: #bfa3f7;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
  }
  .crypto-transaction {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #bfa3f7;
  }
  .transaction-section {
    display: flex;
    flex-wrap: wrap; 
    justify-content: space-between;
    gap: 20px;
  }
  .form-container {
    flex: 1;
    padding: 10px;
    min-width: 200px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #ffffff;
  }
  @media screen and (max-width: 768px) {
    .container {
      flex-direction: column; 
    }
  
    .container div {
      width: 100%; 
    }
  }
  .error {
    color: red;
    margin-top: 10px;
  }
  .success {
    color: red;
    margin-top: 10px;
  }
  form label {
    display: block;
    margin-top: 10px;
  }
  form input,
  form select {
    width: 100%;
    padding: 5px 2px;
    margin-top: 5px;
    border: 1px solid #bfa3f7;
    border-radius: 4px;
  }
  button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #3533cd;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #000000;
  }
  img{
    width: 60px;
    padding-left: 60%;
  }
  .btnGoBack{
    background-color: #3533cd;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btnGoBack:hover{
    background-color: #000000;
    color: #ffffff;
  }
  </style>
    