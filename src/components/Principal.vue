<template>
    <header>
      <img src="" alt="">
      <button @click="logout" class="closeSesion">Cerrar Sesion</button>
      <img src="@/assets/logo.png" alt="Logo">      
    </header>
    <div class="presentation">
      <h1>Bienvenido a <span class="highlight">BTCPOCKET</span></h1>
    </div>
    <div class="btn-group">
        <button @click="goToTransaction" class="btn">Registrar Transacción</button>
        <button @click="goHistory" class="btn">Historial</button>
        <button @click="goAnalisis" class="btn">Analisis</button>
    </div>

    
</template>
  
  <script>
  import { useUserStore } from '../store/user';
  import { useRouter } from 'vue-router';
  
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

    return { logout, goToTransaction, goHistory, goAnalisis };
    }
  };
  </script>
  
  <style scoped>
  img{
    width: 100px;
  }
  header{
    background-color: #bfa3f7;
    padding: 10px;
  }
  .closeSesion{
    background-color: #3533cd;
    color: white;
    float: right;
    margin-top: 30px;
    padding: 8px;
    margin-right: 10px;
    border-radius: 25px;
    font-size: 13px;
  }
  .btn-group {
    display: flex; 
    gap: 20px; 
    justify-content: center; 
    flex-wrap: wrap; 
  }
  .btn{
    padding: 10px 20px;
    background-color: #bfa3f7;
    color: #3533cd;
    font-weight: bold;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    text-align: center;
    font-size: 20px;
    width: 200px;
  }
   button:hover{
    background-color: #3533cd;
    color: #bfa3f7;
  }
  @media (max-width: 768px) {
    .btn-group {
      flex-direction: column; 
      gap: 20px; 
      align-items: center; 
    }

    .btn {
      width: 100%; 
      max-width: 400px; 
    }
  }
  .presentation {
    text-align: center; 
    padding: 20px; 
    font-family: Arial, sans-serif; 
  }

  .presentation h1 {
    font-size: 2.5rem; 
    font-weight: bold;
    margin-top: 40px;
    margin-bottom: 30px; 
  }

  .highlight {
    font-size: 3rem;
    font-weight: bolder; 
    background: linear-gradient(1000deg, #000000, #3533c3, #3533cd); 
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent; 
    display: inline-block; 
  }
</style>
  