
<script type="ts">
  import { initOscillator } from "./logics/canvas";
  import Name from "./plugins/Name.svelte";
  





window.addEventListener("load", () => {
  console.log("page is fully loaded");
  initOscillator(false);
});
</script>
<div class="main-page" on:scroll={(e)=>console.log(window.scrollY)}>
<Name/>
  <canvas id="canvas"></canvas>

</div>