<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title">NuxtWebPush</h1>
      <!-- <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
        >
          GitHub
        </a>
      </div>-->

      <div class="buttons">
        <button class="trigger-push" @click="triggerPush()">Trigger Push Notification</button>
      </div>

      <div class="buttons">
        <button class="trigger-push" @click="test()">Test</button>
      </div>

      <button
        type="button"
        @click="permission"
        class="aktif-notif hover:bg-white hover:text-black bg-blue p-2 border-solid rounded-lg"
      >Subscribe</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      publicVapidKey:
        "BA2UWcTHEy2Ri7DSggjsN70hviNGp-IvDorcACV2IjCDWOBXiDog5wl1eZ7MvW7Yx5kX7CgsC7MyrCoUo5oQPqc"
    };
  },
  methods: {
    test() {
      let result = axios
        .get("http://localhost:3000/api/api")
        .then(res => {
          console.log("res", res);
        })
        .catch(err => {
          console.log(err);
        });
      console.log("result", result);
    },
    triggerPush() {
      this.triggerPushNotification().catch(error => console.error(error));
    },
    async triggerPushNotification() {
      if ("serviceWorker" in navigator) {
        console.log("navigator.serviceWorker", navigator.serviceWorker);
        const register = await navigator.serviceWorker.register("/sw.js", {
          scope: "/"
        });
        console.log("waiting for acceptance");
        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.publicVapidKey)
        });
        console.log("acceptance complete", subscription);
        await axios
          .post("http://localhost:3000/api/subscribe", subscription)
          .then(res => console.log(res));
      } else {
        console.error("Service workers are not supported in this browser");
      }
    },

    permission() {
      if ("Notification" in window) {
        Notification.requestPermission(result => {
          // cek apakah user menerima notifiksinya
          if (result !== "granted") {
            console.log("notifikasi tidak di perbolehkan");
          } else {
            this.confPushSub();
            console.log("notifikasi aktif");
          }
        });
      } else {
        alert("notifikasi tidak didukung ");
      }
    },

    urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
