<script>
import generateCompletions from '../lib/autocomplete.js';

let history = [];
let text = '';
let generated_text = '';
let settings_hidden = true;
let generating = false;
let settings = {
    model: 'neox20b',
    temperature: '0',
    n: '1',
    max_tokens: '100',
    stop: ''
}
function addHistory() {
  history = [...history, [text, generated_text]];
}

async function generate() {
    generating = true;
    let outputs = await generateCompletions(text, settings);
    generating = false;
    // for each element in outputs, replace \n with <br>
    outputs = outputs.map((output) => output.replace(/\n/g, '<br>'));
    generated_text = outputs.join('<br><br>');
    addHistory();
}

function toggle_settings() {
  settings_hidden = !settings_hidden;
}

</script>

<!-- a text area and button to generate text-->
<!-- textarea should take up ~80%of the width and 50% the height of the page-->
<textarea bind:value={text} style="width: 80%; height: 50%;"></textarea>

<!-- Add a history panel next to the main area, that prints each item in it's own div box, which alternate background colors for contrast-->
<!-- within each item, text and generated text are printed seperated by a line, with linebreaks at each br -->
<!-- and place it to the right of the text area -->
<div id="history" style="width: 19%; height: 100%; overflow: scroll; float: right;">
    {#each history as [text, generated_text]}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div style="color: grey;" on:click={() => {text = text; generated_text = generated_text;}}>{text}<br>{generated_text}</div>
    {/each}
</div>
<br>
<!-- the generate button should appear as normal while not generating, then be greyed out with generating... as text while generating -->
{#if !generating}
  <button on:click={generate}>Generate</button>
{:else}
  <button disabled>Generating...</button>
{/if}
<!-- a button that opens a settings panel for the llm -->
<button on:click={toggle_settings}>Settings</button>

<!-- A button to copy the text and generated_text, as: Prompt: {text} <br> Completion: {generated_text} -->
<button on:click={() => {navigator.clipboard.writeText(`Prompt: ${text}\n\nCompletion: ${generated_text}`)}}>Copy</button>

<!-- a settings panel that is hidden by default. contains:
a dropdown for the model, number inputs for temperature, n, and max tokens, and a text input for stop-->
{#if !settings_hidden}
  <div>
    <p>Settings</p>
    <select bind:value={settings.model}>
      <option value="gpt-neox-20b">neox20b</option>
      <!-- <option value="gptj">gptj</option> -->
    </select>
    <br>
    <div>Temperature:</div>
    <input type="number" bind:value={settings.temperature} step="0.1" min="0" max="1">
    <br>
    <div>n:</div>
    <input type="number" bind:value={settings.n} step="1" min="1">
    <br>
    <div>Max Tokens:</div>
    <input type="number" bind:value={settings.max_tokens} step="10" min="0">
    <br>
    <!-- <div>Stop token (optional):</div> -->
    <!-- <input type="text" bind:value={settings.stop}> -->
  </div>

{/if}

<br>
<!-- display the generated_text by looping through generated text, and rendering it with linebreaks -->
<!-- in a scrollable div with height 40% -->
<div style="height: 40%; overflow: scroll;">
    {#each generated_text.split('<br>') as line}
        {line}<br>
    {/each}
</div>