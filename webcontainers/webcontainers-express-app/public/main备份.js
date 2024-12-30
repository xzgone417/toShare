import './style.css';
import { WebContainer } from '@webcontainer/api';
import { files } from './files';
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css';

/** @type {import('@webcontainer/api').WebContainer}  */
let webcontainerInstance;



document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="editor">
      <textarea>I am a textarea</textarea>
    </div>
    <div class="preview">
      <iframe src="loading.html"></iframe>
    </div>
  </div>
    <div class="terminal"></div>
`

/** @type {HTMLIFrameElement | null} */
const iframeEl = document.querySelector('iframe');

/** @type {HTMLTextAreaElement | null} */
const textareaEl = document.querySelector('textarea');

/** @type {HTMLTextAreaElement | null} */
const terminalEl = document.querySelector('.terminal');

// async function installDependencies() {
//   // Install dependencies
//   const installProcess = await webcontainerInstance.spawn('npm', ['install']);

//   installProcess.output.pipeTo(new WritableStream({
//     write(data) {
//       console.log(data);
//     }
//   }));
//   // Wait for install command to exit
//   return installProcess.exit;
// }
/**
 * @param {Terminal} terminal
 */
async function installDependencies(terminal) {
  // Install dependencies
  const installProcess = await webcontainerInstance.spawn('npm', ['install']);
  installProcess.output.pipeTo(new WritableStream({
    write(data) {
      terminal.write(data);
    }
  }))
  // Wait for install command to exit
  return installProcess.exit;
}
 
// async function startDevServer() {
//   // Run `npm run start` to start the Express app
//   await webcontainerInstance.spawn('npm', ['run', 'start']);

//   // Wait for `server-ready` event
//   webcontainerInstance.on('server-ready', (port, url) => {
//     iframeEl.src = url;
//   });
// }
/**
 * @param {Terminal} terminal
 */
async function startDevServer(terminal) {
  // Run `npm run start` to start the Express app
  const serverProcess = await webcontainerInstance.spawn('npm', [
    'run',
    'start',
  ]);
  serverProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );

  // Wait for `server-ready` event
  webcontainerInstance.on('server-ready', (port, url) => {
    iframeEl.src = url;
  });
}

/** @param {string} content*/

async function writeIndexJS(content) {
  await webcontainerInstance.fs.writeFile('/index.js', content);
};

window.addEventListener('load', async () => {
  // Call only once
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);

  textareaEl.value = files['index.js'].file.contents;

  const terminal = new Terminal({
    convertEol: true,
  });
  terminal.open(terminalEl);

  const packageJSON = await webcontainerInstance.fs.readFile('package.json', 'utf-8');
  console.log(packageJSON);
  const exitCode = await installDependencies(terminal);
  if (exitCode !== 0) {
    throw new Error('Installation failed');
  };
  startDevServer(terminal);

  textareaEl.addEventListener('input', (e) => {
    writeIndexJS(e.currentTarget.value);
  });
});

