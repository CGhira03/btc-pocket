<template>
    <div class="transaction-history">
      <header>
        <button @click="goBack" class="btnGoBack">Volver Inicio</button>
        <img src="@/assets/logo.png" alt="Logo">  
      </header>
  
      <h2>Historial de Transacciones</h2>
  
      <div class="table-container">
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
                <button @click="openModal(transaction)">Editar</button>
                <button @click="deleteTransaction(transaction._id)" class="btnDelete">Borrar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
          <span class="close-btn" @click="closeModal">&times;</span>
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
    </div>
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
  
  
  <style scoped>
  .transaction-history {
    padding: 10px;
    max-width: 100%;
    margin: auto;
  }
  
  img {
    width: 70px;
    padding-left: 70%;
  }
  
  h2 {
    text-align: center;
    margin: 20px 0;
  }
  
  .table-container {
    overflow-x: auto;
    margin: 0 auto;
    border-radius: 10px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
  }
  
  th,
  td {
    padding: 8px;
    text-align: center;
  }
  
  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }
  
  button {
    padding: 5px 10px;
    background-color: #bfa3f7;
    color: #3533cd;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 12px;
  }
  
  button:hover {
    background-color: #3533cd;
    color: #fff;
  }
  
  .btnDelete {
    background-color: #3533cd;
    color: #bfa3f7
  }
  
  .btnDelete:hover {
    background-color: #bfa3f7;
    color: #3533cd
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
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: #ffffff;
    padding: 20px;
    width: 80%;
    max-width: 300px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    position: relative;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 30px;
    cursor: pointer;
    color: #000000;
  }
  
  .close-btn:hover {
    color: #3533cd;
  }
  
  /* Responsividad */
  @media screen and (max-width: 768px) {
    th,
    td {
      font-size: 12px;
      padding: 6px;
    }
  
    table {
      font-size: 12px;
    }
  
    button {
      font-size: 10px;
      padding: 4px 8px;
    }
  
    .modal-content {
      width: 90%;
      padding: 20px;
    }
  }
  
  @media screen and (max-width: 480px) {
    table {
      display: block;
    }
    img{
      width: 60px;
      padding-left: 60%;
    }
    thead {
      display: none;
    }
  
    tr {
      display: block;
      margin-bottom: 15px;
      border: 1px solid;
      margin: 20px;
      border-radius: 20px;
    }
  
    td {
      display: block;
      text-align: left;
      position: relative;
      padding: 10px;
      width: 100%;
    }
  
    td::before {
      content: attr(data-label);
      font-weight: bold;
      display: inline-block;
      margin-right: 10px;
      color: #555;
    }
  }
  
  @media screen and (max-width: 320px) {
    h2 {
      font-size: 18px;
    }
  
    button {
      font-size: 8px;
      padding: 4px 6px;
    }
  }
  </style>
  
    