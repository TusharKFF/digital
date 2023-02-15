    function goBack() {
      history.back();
    }

    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('inputPhoneNumber');
    const countryCodeInput = document.getElementById('inputCountryCode');

    //insert custom cancel button
    const cancelButton = document.getElementById('cancel');
    const customCancelButton = document.createElement('button');
    customCancelButton.setAttribute('id', 'customCancelButton');
    customCancelButton.innerHTML = cancelButton.innerHTML;
    customCancelButton.onclick = function()
    {
        history.back();
    }
    cancelButton.insertAdjacentElement('afterend', customCancelButton);


    //hide country code
    countryCodeInput.style.display = 'none';

    // Insert custom input field labels
    const emailLabel = document.createElement('span');
    emailLabel.setAttribute('id', 'emailLabel');
    const phoneLabel = document.createElement('span');
    phoneLabel.setAttribute('id', 'phoneLabel');

    // Error states - Email
    const TextBox = document.getElementsByClassName('TextBox')[0];

    const emailError = document.createElement('div');
    emailError.setAttribute('id', 'emailError');
    TextBox.insertAdjacentElement('afterend', emailError);

    const defaultEmailError = document.getElementsByClassName('error itemLevel')[0];
    let isEmailError = false;

    const emailObserver = new MutationObserver(function (e) {
      if (e[0].target.innerHTML !== '') {
        emailInput.style.border = '2px solid #BA1B1B';
        emailInput.style.margin = '0';
        emailInput.style.outline = 'none';
        emailLabel.setAttribute('id', 'emailLabel--error');
        emailError.innerHTML = defaultEmailError.innerHTML;
        emailError.setAttribute('class', 'inputError inputError--visible');
        isEmailError = true;
      } else {
        emailInput.style.border = '';
        emailInput.style.margin = '';
        emailInput.style.outline = '';
        emailLabel.setAttribute('id', 'emailLabel');
        emailError.setAttribute('class', 'inputError');
        isEmailError = false;
      }
    });
    emailObserver.observe(defaultEmailError, { childList: true });

    // Error states - Phone
    const TextBoxPhone = document.getElementsByClassName('TextBox')[1];

    const phoneError = document.createElement('div');
    phoneError.setAttribute('id', 'emailError');
    TextBoxPhone.insertAdjacentElement('afterend', phoneError);

    const defaultPhoneError = document.getElementsByClassName('error itemLevel')[2];
    let isPhoneError = false;

    const phoneObserver = new MutationObserver(function (e) {
      if (e[0].target.innerHTML !== '') {
        phoneInput.style.border = '2px solid #BA1B1B';
        phoneInput.style.margin = '0';
        phoneInput.style.outline = 'none';
        phoneLabel.setAttribute('id', 'phoneLabel--error');
        phoneError.innerHTML = defaultPhoneError.innerHTML;
        phoneError.setAttribute('class', 'inputError inputError--visible');
        isPhoneError = true;
      } else {
        phoneInput.style.border = '';
        phoneInput.style.margin = '';
        phoneInput.style.outline = '';
        phoneLabel.setAttribute('id', 'phoneLabel');
        phoneError.setAttribute('class', 'inputError');
        isPhoneError = false;
      }
    });

    phoneObserver.observe(defaultPhoneError, { childList: true });

    // Handle server error message
    const claimVerificationServerError = document.getElementById('claimVerificationServerError');
    const serverError = document.getElementById('serverError');
    const serverErrorMessage = document.getElementById('serverErrorMessage');

    const serverErrorObserver = new MutationObserver(function (e) {
      if (e[0].target.innerHTML !== '') {
        serverError.style.display = 'flex';
        serverErrorMessage.innerHTML = claimVerificationServerError.innerHTML;
      }
      else {
        serverError.style.display = 'none';
        serverErrorMessage.innerHTML = '';
      }
    });
    serverErrorObserver.observe(claimVerificationServerError, { childList: true });

    // Remove placeholders
    emailInput.setAttribute('placeholder', " ");
    emailInput.removeAttribute("title");
    phoneInput.setAttribute('placeholder', " ");

    emailLabel.innerHTML = 'Email';
    phoneLabel.innerHTML = 'Phone number';

    emailInput.insertAdjacentElement('afterend', emailLabel);
    phoneInput.insertAdjacentElement('afterend', phoneLabel);

    // Continue button loading state
    const continueButton = document.getElementById('continue');
    const continueButtonText = continueButton.innerText;
    const loadingObserver = new MutationObserver(function (e) {
      if (e[0].target.id === 'verifying_blurb') {
        continueButton.innerHTML = `
      <div class="loading-spinner" role="progressbar">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    `;
      } else if (e[0].target.id === 'continue') {
        // Do nothing
      } else {
        continueButton.innerHTML = continueButtonText;
      }
    });
    loadingObserver.observe(document, { childList: true, subtree: true });



    //Formart phone
    const isNumericInput = (event) => {
      const key = event.keyCode;
      return ((key >= 48 && key <= 57) || // Allow number line
        (key >= 96 && key <= 105) // Allow number pad
      );
    };

    const isModifierKey = (event) => {
      const key = event.keyCode;
      return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
        (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
        (key > 36 && key < 41) || // Allow left, up, right, down
        (
          // Allow Ctrl/Command + A,C,V,X,Z
          (event.ctrlKey === true || event.metaKey === true) &&
          (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
        )
    };

    const enforceFormat = (event) => {
      // Input must be of a valid number format or a modifier key, and not longer than ten digits
      if (!isNumericInput(event) && !isModifierKey(event)) {
        event.preventDefault();
      }
    };

    const formatToPhone = (event) => {
      if (isModifierKey(event)) { return; }

      const input = event.target.value.replace(/\D/g, '').substring(0, 10); // First ten digits of input only
      const areaCode = input.substring(0, 3);
      const middle = input.substring(3, 6);
      const last = input.substring(6, 10);

      if (input.length > 6) { event.target.value = `(${areaCode}) ${middle}-${last}`; }
      else if (input.length > 3) { event.target.value = `(${areaCode}) ${middle}`; }
      else if (input.length > 0) { event.target.value = `(${areaCode}`; }
    };

    phoneInput.addEventListener('keydown', enforceFormat);
    phoneInput.addEventListener('keyup', formatToPhone);