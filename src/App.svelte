<script lang="ts">
import MainPage from "./lib/mainpage/MainPage.svelte";

window.addEventListener("scroll",()=>console.log(window.scrollX, window.scrollY))

</script>

<main>
<MainPage/>
<div class="app-div">hello</div>
<div class="app-div">hello</div>
<div class="app-div">h</div>
<div class="app-div">fff</div>
<div class="app-div">ffff</div>

</main>

<style>
  .app-div{
    border:1px solid red;
    height:100vh;
    width:100%;
  }
</style>