<template>
    <div class="login-container">
      <div class="login-box">
        <img src="@/assets/logo3.png" alt="Logo" class="login-logo">
        <h1 class="login-title">BTCPocket</h1>
        <form @submit.prevent="handleLogin">
          <label for="id">Ingrese su ID: </label>
          <input
            type="text"
            id="login"
            class="login-input"
            v-model="userId"
            placeholder="Ingrese ID"
            required
          />
          <br>
          <button type="submit" class="btn-enter">Iniciar Sesión</button>
        </form>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </div>
    </div>
</template>
  
<script>
  import { useRouter } from "vue-router";
  import { ref } from "vue";           
  
  export default {
    setup() {
      const userId = ref("");            
      const errorMessage = ref("");      
      const router = useRouter();        
  
      const handleLogin = async () => {
        if (userId.value.trim()) {
          try {
            localStorage.setItem("user_id", userId.value.trim());
  
            router.push("/principal");
          } catch (error) {
            console.error("Error al iniciar sesión:", error);
            errorMessage.value = "Error al intentar iniciar sesión.";
          }
        } else {
          errorMessage.value = "El ID de usuario es obligatorio.";
        }
      };
  
      return { userId, errorMessage, handleLogin };
    },
  };
</script>
