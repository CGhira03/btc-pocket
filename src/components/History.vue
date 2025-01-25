<template>
      <header class="principal-header">
        <button @click="goBack" class="btnGoBack">Volver Inicio</button>
        <img src="@/assets/logo3.png" alt="" class="transactions-logo">
      </header>
  
      <section class="history-container">
        <h2 style="color: #ffffff; text-align: center;">Historial de Transacciones</h2>
  
        <div class="history-table-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Acción</th>
                <th>Criptomoneda</th>
                <th>Cantidad</th>
                <th>Monto (ARS)</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(transaction, index) in transactions" :key="transaction._id">
                <td data-label="Fecha">{{ formatDate(transaction.datetime) }}</td>
                <td data-label="Acción">{{ transaction.action }}</td>
                <td data-label="Criptomoneda">{{ transaction.crypto_code }}</td>
                <td data-label="Cantidad">{{ transaction.crypto_amount }}</td>
                <td data-label="Monto (ARS)">{{ transaction.money }}</td>
                <td data-label="Opciones">
                  <button @click="openModal(transaction)" class="history-btn-edit">Editar</button>
                  <button @click="deleteTransaction(transaction._id)" class="history-btn-del">Borrar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
    
        <div v-if="isModalOpen" class="history-modal">
          <div class="history-modal-content">
            <span class="history-modal-close-btn" @click="closeModal">&times;</span>
            <h2>Editar Transacción</h2>
            <form @submit.prevent="saveChanges">
              <label>Fecha:</label>
              <input type="datetime-local" v-model="selectedTransaction.datetime" required /><br /><br />
    
              <label>Acción:</label>
              <select v-model="selectedTransaction.action">
                <option value="purchase">Compra</option>
                <option value="sale">Venta</option>
              </select><br /><br />
    
              <label for="crypto-edit">Criptomoneda:</label>
              <select
                id="crypto-edit"
                v-model="selectedTransaction.crypto_code"
                @change="updateEditPrice"
                required
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT">USDC</option>
                <option value="DAI">DAI</option>
                <option value="SOL">SOL</option>
              </select><br /><br />
    
              <label>Cantidad:</label>
              <input
                type="number"
                v-model.number="selectedTransaction.crypto_amount"
                required
                min="0.001"
              /><br /><br />
    
              <p>Precio unitario (ARS): {{ selectedTransaction.money.toFixed(2) }}</p>
              <p>Total (ARS): {{ (selectedTransaction.crypto_amount * selectedTransaction.money).toFixed(2) }}</p>
    
              <button type="submit">Guardar Cambios</button>
            </form>
          </div>
        </div>
      </section>
      
  </template>
  
<script>
  import axios from "axios";
  import { useUserStore } from "../store/user";
  import { useRouter } from "vue-router";
  import { getCryptoPrice } from "@/services/api";
  
  export default {
    data() {
      return {
        transactions: [],
        selectedTransaction: null,
        isModalOpen: false,
        userId: useUserStore().userId,
        apiKey: "60eb09146661365596af552f",
      };
    },
    setup() {
      const router = useRouter();
      const goBack = () => router.push("/principal");
      return { goBack };
    },
    methods: {
      async fetchTransactions() {
        const url = `https://laboratorio3-f36a.restdb.io/rest/transactions?q={\"user_id\": \"${this.userId}\"}`;
        try {
          const response = await axios.get(url, {
            headers: { "x-apikey": this.apiKey },
          });
          this.transactions = response.data;
        } catch (error) {
          console.error("Error al obtener transacciones: ", error);
          alert("No se pudo cargar el historial de transacciones.");
        }
      },
  
      openModal(transaction) {
        this.selectedTransaction = { ...transaction };
        this.isModalOpen = true;
      },
  
      async saveChanges() {
        try {
          const cryptoPrice = await getCryptoPrice(this.selectedTransaction.crypto_code);
          this.selectedTransaction.money = cryptoPrice;
  
          const url = `https://laboratorio3-f36a.restdb.io/rest/transactions/${this.selectedTransaction._id}`;
          await axios.patch(url, this.selectedTransaction, {
            headers: { "x-apikey": this.apiKey },
          });
          alert("Transacción actualizada con éxito.");
          this.fetchTransactions();
          this.closeModal();
        } catch (error) {
          console.error("Error al guardar cambios: ", error);
          alert("Error al guardar los cambios de la transacción.");
        }
      },
  
      async deleteTransaction(id) {
        const url = `https://laboratorio3-f36a.restdb.io/rest/transactions/${id}`;
        try {
          await axios.delete(url, {
            headers: { "x-apikey": this.apiKey },
          });
          alert("Transacción eliminada con éxito.");
          this.fetchTransactions();
        } catch (error) {
          console.error("Error al borrar transacción: ", error);
          alert("Error al eliminar la transacción.");
        }
      },
  
      async updateEditPrice() {
        try {
          const price = await getCryptoPrice(this.selectedTransaction.crypto_code);
          this.selectedTransaction.money = price;
        } catch (error) {
          console.error("Error al obtener el precio actualizado: ", error);
          alert("No se pudo actualizar el precio de la criptomoneda.");
        }
      },
  
      closeModal() {
        this.isModalOpen = false;
        this.selectedTransaction = null;
      },
  
      formatDate(date) {
        return new Date(date).toLocaleString();
      },
    },
    created() {
      this.fetchTransactions();
    },
  };
</script>
  
  
 
    