<template>
  <header class="principal-header">
    <button @click="goBack" class="btnGoBack">Volver Inicio</button>
    <img src="@/assets/logo3.png" alt="" class="transactions-logo">
  </header>

  <div class="financial-analysis">
    <h2 style="color: #ffffff; text-align: center;">Análisis de Estado Actual</h2>

    <!-- Tabla con detalles de criptomonedas -->
    <table class="analisys-table">
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
          <td>{{ Number(crypto.amount).toFixed(4) }}</td>
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
    <h2 style="color: #000000; text-align: center;">Resultado de Inversiones</h2>
    <table class="analisys-table">
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Resultado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, code) in investmentResults" :key="code">
          <td>{{ code }}</td>
          <td :class="Number(result) > 0 ? 'positive' : 'negative'">
            {{ Number(result) >= 0 ? '+' : '-' }} {{ formatCurrency(Math.abs(result)) }}
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
      cryptoData: {},
      totalMoney: 0,
      investmentResults: {},
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
    // Formatear valores como moneda con redondeo
    formatCurrency(value) {
      if (isNaN(value) || value === undefined || value === null) {
        return "$ 0.00"; // Manejo de valores inválidos
      }
      return `$ ${Number(value).toFixed(2)}`;
    },

    // Obtener transacciones del usuario
    async fetchTransactions() {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          throw new Error("El user_id no está definido en el localStorage.");
        }

        const apiKey = "60eb09146661365596af552f";
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

    // Procesar y calcular datos financieros con redondeo
    async processData() {
      try {
        const prices = await Promise.all([
          this.fetchCryptoPrice("BTC"),
          this.fetchCryptoPrice("ETH"),
          this.fetchCryptoPrice("USDT"),
          this.fetchCryptoPrice("DAI"),
          this.fetchCryptoPrice("SOL"),
        ]);

        const [btcPrice, ethPrice, usdtPrice, daiPrice, solPrice] = prices;

        const cryptoData = {};
        const investmentResults = {};
        let totalMoney = 0;

        this.transactions.forEach((transaction) => {
          const code = transaction.crypto_code;
          const amount = parseFloat(transaction.crypto_amount) || 0;
          const money = parseFloat(transaction.money) || 0;

          if (!cryptoData[code]) {
            cryptoData[code] = { amount: 0, totalValue: 0 };
          }

          if (transaction.action === "purchase") {
            cryptoData[code].amount += amount;
          } else if (transaction.action === "sale") {
            cryptoData[code].amount -= amount;
          }

          const currentPrice =
            code === "BTC" ? btcPrice :
            code === "ETH" ? ethPrice :
            code === "USDT" ? usdtPrice :
            code === "DAI" ? daiPrice :
            solPrice;

          cryptoData[code].totalValue = Number(cryptoData[code].amount * currentPrice).toFixed(2);
          totalMoney += parseFloat(cryptoData[code].totalValue);

          investmentResults[code] = Number(cryptoData[code].totalValue - money).toFixed(2);
        });

        this.cryptoData = cryptoData;
        this.totalMoney = Number(totalMoney).toFixed(2);
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
        return Number(response.data.totalBid || 0).toFixed(2);
      } catch (error) {
        console.error(`Error al obtener precio de ${cryptoCode}:`, error);
        return "0.00";
      }
    },
  },

  mounted() {
    this.fetchTransactions();
  },
};
</script>
