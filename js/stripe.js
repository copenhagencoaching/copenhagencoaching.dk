$(document).ready(function () {
    // Stripe settings
    var stripe = Stripe("pk_live_51HNEkULP16G7K8GRyMcClY4AYRLCPZxth79GJ6FE2dfApunT8uaNq7H9j8V2CGLMa1NvFXKs8pkiHH97YIt9y5QK00Y4kDJrAp");
    var elements = stripe.elements();
    var style = {
      base: {
        color: "#32325d",
      },
    };
    var card = elements.create("card", {
      style: style,
    });
  
    card.mount("#card-element");
    card.on("change", ({ error }) => {
      const displayError = document.getElementById("card-errors");
      if (error) {
        displayError.textContent = error.message;
      } else {
        displayError.textContent = "";
      }
    });
    // end stripe
  
    var form = document.getElementById("payment-form");
    form.addEventListener("submit", function (ev) {
      event.preventDefault();
  
      stripe
        .createPaymentMethod({
          type: "card",
          card: card,
          billing_details: {
            // Include any additional collected billing details.
            name: "Jenny Rosen",
            email: "jenny@rosen.com",
          },
        })
        .then(stripePaymentMethodHandler);
    });
  
    function stripePaymentMethodHandler(result) {
      if (result.error) {
        console.log("Error creating payment method");
      } else {
        // First submission attempt
        fetch("https://formspree.io/f/FORM_ID", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _payment_method: result.paymentMethod.id,
            email: "jenny@rosen.com",
          }),
        }).then(function (response) {
          // Handle server response (see Step 4)
          response.json().then(function (json) {
            handleServerResponse(json);
          });
        });
      }
    }
  
    function handleServerResponse(response) {
      if (response.data && response.data.requires_action) {
        // Stripe require additional actions to charge this card
        // Use Stripe.js to handle required card action and open 3DS
        stripe
          .handleCardAction(response.data.payment_intent_client_secret)
          .then(function (stripeResult) {
            // Get handleCardAction response and resubmit
            resubmitForm(stripeResult, response.resubmit_key);
          });
      } else if (response.error) {
        // Show error from server on payment form
        console.log(response.error);
      } else {
        console.log("Payment finished successfully");
      }
    }
  
    function resubmitForm(result, resubmit_key) {
      console.log("handle Stripe SCA result");
      if (result.error) {
        // Display error in the payment form
        console.log("Stripe SCA error");
      } else {
        // The card action has been handled
        // The PaymentIntent can be confirmed again on the server
        fetch("https://formspree.io/f/FORM_ID", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _payment_intent: result.paymentIntent.id,
            _resubmit_key: resubmit_key,
            email: "jenny@rosen.com",
          }),
        })
          .then(function (confirmResult) {
            return confirmResult.json();
          })
          .then(handleServerResponse);
      }
    }
  });