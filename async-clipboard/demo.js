/** Write contents of the textarea to the clipboard when clicking "Copy" */
document.querySelector('#copy').addEventListener('click', () => {
  navigator.clipboard.writeText(document.querySelector('#out').value)
    .then(() => {
      ChromeSamples.log('Text copied.');
    })
    .catch(() => {
      ChromeSamples.log('Failed to copy text.');
    });
});

document.querySelector('#copyx').addEventListener('click', async () => {
  const text = document.querySelector('#out').value;

  const format1 = 'text/plain';
  const promise_text_blob = Promise.resolve(new Blob([text], {type: format1}));

  const format2 = 'text/html';
  const promise_html_blob = Promise.resolve(new Blob(["<p>" + text + "</p>"], {type: format2}));
  const clipboardItemInput = new ClipboardItem(
    {[format1]: promise_text_blob, [format2]: promise_html_blob, },
    {presentationStyle: "unspecified"});
  await navigator.clipboard.write([clipboardItemInput]);
});

/** Read from clipboard when clicking the Paste button */
document.querySelector('#paste').addEventListener('click', () => {
  navigator.clipboard.readText()
    .then(text => {
      document.querySelector('#out').value = text;
      ChromeSamples.log('Text pasted.');
    })
    .catch(() => {
      ChromeSamples.log('Failed to read from clipboard.');
    });
});

/** Read from clipboard when clicking the Paste button */
document.querySelector('#pastex').addEventListener('click', async () => {
  const items = await navigator.clipboard.read();

  const textBlob = await items[0].getType("text/html");
  const text = await (new Response(textBlob)).text();
  document.querySelector('#out').value = text;
  ChromeSamples.log('Html pasted.');
});

/** Watch for pastes */
document.addEventListener('paste', e => {
  e.preventDefault();
  navigator.clipboard.readText().then(text => {
    ChromeSamples.log('Updated clipboard contents: ' + text);
  });
});

/** Set up buttons to request permissions and display status: */
document.querySelectorAll('[data-permission]').forEach(btn => {
  const permission = btn.getAttribute('data-permission');
  navigator.permissions.query({name: permission})
    .then(status => {
      status.onchange = () => {
        btn.setAttribute('data-state', status.state);
      };
      status.onchange();
    })
    .catch(() => {
      btn.setAttribute('data-state', 'unavailable');
      btn.title = 'Permissions API unavailable.';
    });
  btn.addEventListener('click', () => {
    Promise.resolve().then(() => {
      return navigator.permissions.query({name: permission});
    })
      .then(status => {
        ChromeSamples.log('Permission: ' + status.state);
      })
      .catch(err => {
        ChromeSamples.log('Permission request failed: ' + err);
      });
  });
});
