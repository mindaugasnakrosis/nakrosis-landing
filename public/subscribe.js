// Newsletter signup: submit to Buttondown in the background and confirm inline,
// so readers never leave the page. Without JS the form still posts normally.
document.querySelectorAll('.subscribe-form').forEach(function (form) {
  var status = form.parentNode.querySelector('.subscribe-status');
  var button = form.querySelector('button');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    button.disabled = true;
    button.textContent = 'Subscribing…';
    status.textContent = '';
    status.classList.remove('is-error');

    fetch(form.action, { method: 'POST', body: new FormData(form) })
      .then(function (response) {
        if (!response.ok) throw new Error(response.status);
        form.hidden = true;
        status.textContent = "You're subscribed. New pieces will arrive in your inbox.";
        status.classList.add('is-success');
        status.focus();
      })
      .catch(function () {
        button.disabled = false;
        button.textContent = 'Subscribe';
        status.textContent = "That didn't go through. Check the address and try again.";
        status.classList.add('is-error');
      });
  });
});
