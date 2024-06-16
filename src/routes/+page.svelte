<script lang="ts">
  import { onMount } from "svelte";

  export let data;

  let name: string;
  let subscribed: boolean | null = null;
  let existingSubscription: PushSubscription | null = null;
  let swSupported: false;

  function urlBase64ToUint8Array(base64String: string) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
  
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const togglePushNotificationsSubscription = async () => {
    if (subscribed === false) {
      const res = await fetch('/getPushPublicKey');
      const resBody = await res.json();
      const pushPublicKey = resBody.publicKey;
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(pushPublicKey),
      });
      const r = await fetch('/savePushSubscription', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          subscription
        })
      });
      const rBody = await r.json();
      console.log(rBody);
    } else {
      if (existingSubscription) {
        const r = await fetch('/deleteSubscription', {
          method: 'GET',
          credentials: 'same-origin',
        });
        const rBody = await r.json();
        console.log(rBody);
        if (rBody.sucess) {
          const successfullyUnsubscribed = await existingSubscription.unsubscribe();
          if (successfullyUnsubscribed) {
            console.log('%c Successfully Unsubscribed', 'color: green');
          } else {
            console.log('%c Couldnt Unsubscribe', 'color: red');
          }
        } else {
          console.log('%c Couldnt Unsubscribe', 'color: red');
        }
      }
    }
    subscribed = !subscribed;
  };

  onMount(async () => {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/service-worker.js", {
          scope: "/",
        });
        console.log('service worker registered');
        const registration = await navigator.serviceWorker.ready;
        existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
          console.log('existingSubscription: ', existingSubscription);
          subscribed = true;
          return;
        }
        subscribed = false;
      } catch (error) {
        console.error(`Registration failed with ${error}`);
      }
    } else {
      swSupported = false;
    }
  });
</script>

<div class="center">
  {#if swSupported}
    {#if subscribed === null}
      <h1>Loading...</h1>
    {:else}
      <h2>Push Notifications: </h2>
      {#if !existingSubscription}
        <input type="text" bind:value={name}>
      {:else}
        <h2>You're subscribed as {data.name}</h2>
      {/if}
      <button on:click={togglePushNotificationsSubscription}>{ subscribed ? 'Unsubscribe' : 'Subscribe' }</button>
    {/if}
  {:else}
    <h1>Your browser doesn't support service workers</h1>
  {/if}
</div>

<style>
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }
</style> 