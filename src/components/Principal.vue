<template>
  <div>
    <header class="principal-header">
      <img src="@/assets/logo2.png" alt="Logo" class="principal-logo" />
      <button @click="logout" class="close-session">Cerrar Sesión</button>
    </header>

    <div class="principal-content">
      <div class="principal-info-section">
        <div class="principal-presentation">
          <h1>Bienvenido a <span class="highlight"><br>BTCPOCKET</span></h1>
        </div>

        <!-- Precios de Criptomonedas -->
        <div id="app" class="crypto-container">
          <h2>Precios de Criptomonedas</h2>
          <ul class="crypto-list">
            <li
              class="crypto-item"
              v-for="crypto in cryptos"
              :key="crypto.code"
            >
              <IconifyIcon :icon="crypto.icon" class="crypto-icon" />
              <div class="crypto-info">
                <span class="crypto-name">{{ crypto.name }}</span>
                <span v-if="crypto.buyPrice && crypto.sellPrice">
                  Compra: $ {{ crypto.buyPrice }} | Venta: $ {{ crypto.sellPrice }}
                </span>
                <span v-else>Cargando...</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Botones de Acciones -->
      <div class="principal-btn-group">
        <button @click="goToTransaction" class="principal-btn">Registrar Transacción</button>
        <button @click="goHistory" class="principal-btn">Historial</button>
        <button @click="goAnalisis" class="principal-btn">Análisis</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';
import { reactive, onMounted } from 'vue';
import axios from 'axios';

export default {

  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    const logout = () => {
      userStore.logout();
      router.push('/');
    };

    const goToTransaction = () => {
      router.push("/transactions");
    };

    const goHistory = () => {
      router.push("/history");
    };

    const goAnalisis = () => {
      router.push("/analisis");
    };

    // Definir los iconos de las criptomonedas usando los nombres correctos de Iconify
    const cryptos = reactive([
      { name: 'Bitcoin', code: 'btc', buyPrice: null, sellPrice: null, icon: 'bitcoin' }, 
      { name: 'Ethereum', code: 'eth', buyPrice: null, sellPrice: null, icon: 'ethereum' }, 
      { name: 'USDC', code: 'USDT', buyPrice: null, sellPrice: null, icon: 'currency-usd' }, 
    ]);

    const fetchCryptoPrices = async () => {
      for (let crypto of cryptos) {
        try {
          const url = `https://criptoya.com/api/satoshitango/${crypto.code}/ars`;
          const response = await axios.get(url);
          crypto.buyPrice = response.data.ask;
          crypto.sellPrice = response.data.bid;
        } catch (error) {
          console.error(`Error fetching price for ${crypto.name}:`, error);
          crypto.buyPrice = 'Error';
          crypto.sellPrice = 'Error';
        }
      }
    };

    onMounted(() => {
      fetchCryptoPrices();
      setInterval(fetchCryptoPrices, 30000); // Actualiza cada 30 segundos
    });

    return { logout, goToTransaction, goHistory, goAnalisis, cryptos };
  }
};
</script>

