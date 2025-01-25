import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: localStorage.getItem("user_id") || null,
  }),

  actions: {
    login(id) {
      this.userId = id; 
      localStorage.setItem("user_id", id.trim()); 
    },

    logout() {
      this.userId = null; 
      localStorage.removeItem("user_id"); 
    },
 }
});
