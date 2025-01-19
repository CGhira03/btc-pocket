import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Principal from '@/components/Principal.vue';
import { useUserStore } from '../store/user';
import Analisis from '@/components/Analisis.vue';
import Transactions from '@/components/Transactions.vue';
import History from '@/components/History.vue';
 
const routes = [
  { path: '/', name: 'Login', component: Login },
  {
    path: '/principal',
    name: 'Principal',
    component: Principal,
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.userId) {
        next();
      } else {
        next('/');
      }
      console.log('Checking authentication:', userStore.userId);
    }
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: Transactions,
  },
  {
    path: "/history", 
    name: "History",
    component: History,
  },
  {
    path: "/analisis",
    name: "Analisis",
    component: Analisis
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
