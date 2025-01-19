<template>
    <header>
      <button @click="goBack" class="btnGoBack">Volver Inicio</button>
      <img src="@/assets/logo.png" alt="Logo"> 
    </header>
    <div class="financial-analysis">
      <h2>Análisis de Estado Actual</h2>
  
      <!-- Tabla con detalles de criptomonedas -->
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Dinero</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(crypto, code) in cryptoData" :key="code">
            <td>{{ code }}</td>
            <td>{{ crypto.amount.toFixed(2) }}</td>
            <td>{{ formatCurrency(crypto.totalValue) }}</td>
          </tr>
          <tr>
            <td><strong>Total</strong></td>
            <td></td>
            <td><strong>{{ formatCurrency(totalMoney) }}</strong></td>
          </tr>
        </tbody>
      </table>
  
      <!-- Tabla con resultado de inversiones -->
      <h2>Resultado de Inversiones</h2>
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, code) in investmentResults" :key="code">
            <td>{{ code }}</td>
            <td :class="result > 0 ? 'positive' : 'negative'">
              {{ result >= 0 ? '+' : '-' }} {{ formatCurrency(Math.abs(result)) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { useRouter } from "vue-router";
  
  export default {
    data() {
      return {
        transactions: [],
        cryptoData: {}, // Datos procesados de criptomonedas
        totalMoney: 0,  // Total de dinero calculado
        investmentResults: {}, // Resultados de las inversiones
      };
    },
    setup() {
      const router = useRouter();
      const goBack = () => {
        router.push("/principal");
      };
      return { goBack };
    },
    methods: {
      // Obtener transacciones del usuario
      async fetchTransactions() {
        try {
          const user_id = localStorage.getItem("user_id");
          if (!user_id) {
            throw new Error("El user_id no está definido en el localStorage.");
          }
  
          const apiKey = "60eb09146661365596af552f"; // Clave de API
          const response = await axios.get(
            `https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id": "${user_id}"}`,
            {
              headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey,
              },
            }
          );
  
  
          this.transactions = response.data;
          await this.processData();
        } catch (error) {
          console.error("Error al obtener transacciones:", error);
        }
      },
  
      // Procesar y calcular datos financieros
      async processData() {
        try {
          const btcPrice = await this.fetchCryptoPrice("BTC");
          const ethPrice = await this.fetchCryptoPrice("ETH");
          const usdtPrice = await this.fetchCryptoPrice("USDT");
  
          const cryptoData = {};
          const investmentResults = {};
  
          let totalMoney = 0;
  
          this.transactions.forEach((transaction) => {
            const code = transaction.crypto_code;
            const amount = parseFloat(transaction.crypto_amount);
            const money = parseFloat(transaction.money);
  
            if (!cryptoData[code]) {
              cryptoData[code] = { amount: 0, totalValue: 0 };
            }
  
            // Actualizar cantidades y valores totales
            if (transaction.action === "purchase") {
              cryptoData[code].amount += amount;
            } else if (transaction.action === "sale") {
              cryptoData[code].amount -= amount;
            }
  
            // Cálculo del valor actual
            const currentPrice =
              code === "BTC" ? btcPrice : code === "ETH" ? ethPrice : usdtPrice;
  
            cryptoData[code].totalValue = cryptoData[code].amount * currentPrice;
            totalMoney += cryptoData[code].totalValue;
  
            // Calcular resultados de inversión
            investmentResults[code] =
              (cryptoData[code].amount * currentPrice) - money;
          });
  
          this.cryptoData = cryptoData;
          this.totalMoney = totalMoney;
          this.investmentResults = investmentResults;
        } catch (error) {
          console.error("Error al procesar datos financieros:", error);
        }
      },
  
      // Obtener precio en tiempo real de una criptomoneda
      async fetchCryptoPrice(cryptoCode) {
        try {
          const response = await axios.get(
            `https://criptoya.com/api/satoshitango/${cryptoCode.toLowerCase()}/ars`
          );
          return response.data.totalBid || 0;
        } catch (error) {
          console.error(`Error al obtener precio de ${cryptoCode}:`, error);
          return 0;
        }
      },
  
      // Formatear valores como moneda
      formatCurrency(value) {
        return `$ ${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
      },
    },
  
    mounted() {
      this.fetchTransactions();
    },
  };
  </script>
  
  <style scoped>
  .financial-analysis {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }
  
  h2, h3 {
    text-align: center;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
  }
  
  th {
    background-color: #f4f4f4;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  .positive {
    color: green;
  }
  
  .negative {
    color: red;
  }
  
  img {
    width: 60px;
    padding-left: 60%;
  }
  
  .btnGoBack {
    background-color: #3533cd;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btnGoBack:hover {
    background-color: #000000;
    color: #ffffff;
  }
  
  header {
    background-color: #bfa3f7;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
  }
  </style>
  