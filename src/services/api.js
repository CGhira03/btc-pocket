import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://laboratorio3-f36a.restdb.io/rest/", // URL base de la API de transacciones
  headers: {
    "x-apikey": "60eb09146661365596af552f", // Clave API para autenticación
  },
});

// Crear una nueva transacción
export const createTransaction = async (transaction) => {
  if (!transaction || typeof transaction !== "object") {
    throw new Error("Transacción inválida.");
  }
  try {
    const response = await apiClient.post("/transactions", transaction);
    return response.data;
  } catch (error) {
    console.error("Error al crear la transacción:", error.response?.data || error.message);
    throw new Error("Hubo un error al registrar la transacción.");
  }
};

// Obtener el precio de una criptomoneda desde CriptoYa
export const getCryptoPrice = async (cryptoCode) => {
  if (!cryptoCode) {
    throw new Error("Código de criptomoneda inválido.");
  }
  try {
    const url = `https://criptoya.com/api/satoshitango/${cryptoCode}/ars`;
    const response = await axios.get(url);

    if (response.data && response.data.ask) {
      return response.data.ask;
    } else {
      throw new Error("El precio no se pudo obtener.");
    }
  } catch (error) {
    console.error("Error al obtener el precio de compra:", error.response?.data || error.message);
    throw new Error("Hubo un error al obtener el precio de compra.");
  }
};

export default {
  getCryptoPrice,
  createTransaction,
  apiClient,
};
