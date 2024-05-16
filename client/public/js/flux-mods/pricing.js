const response = await fetch(
  'https://api.flux.codegasms.com/mods/token-plans',
  {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  }
);

const defaultPlans = [
  {
    planID: 'plan1',
    title: 'Basic',
    tokenCountPerMo: 100,
    summary: `Access all features\n5 watchlists included\nChat support\nOptimize hashtags\n5 exclusive widgets`,
    pricing: {
      pricePerMo: 99.99,
      discounts: {
        halfYearly: 5,
        yearly: 10,
      },
    },
  },
  {
    planID: 'plan2',
    title: 'Pro',
    tokenCountPerMo: 200,
    summary: `Access all features\nUnlimited watchlists\nChat support\nOptimize hashtags\n10+ exclusive pro widgets`,
    pricing: {
      pricePerMo: 999.99,
      discounts: {
        halfYearly: 10,
        yearly: 20,
      },
    },
  },
  {
    planID: 'plan2',
    title: 'ProPlus',
    tokenCountPerMo: 300,
    summary: `Access all features\nUnlimited watchlists\nChat support\nOptimize hashtags\n10+ exclusive pro widgets`,
    pricing: {
      pricePerMo: 2999.99,
      discounts: {
        halfYearly: 15,
        yearly: 25,
      },
    },
  },
];

function convertFeaturesStringToArray(featuresString) {
  return featuresString
    .split('\n')
    .map((summary) => summary.trim())
    .filter((summary) => summary !== '');
}

function updateFeaturesArray(plans) {
  return plans.map((plan) => {
    return {
      ...plan,
      summary: convertFeaturesStringToArray(plan.summary),
    };
  });
}

const responsePlans = await response.json();
const plans = responsePlans || defaultPlans;
// const plans = defaultPlans;

const updatedPlans = updateFeaturesArray(plans);
// console.log(updatedPlans);

window.onload = () => {
  var currentType = 'monthly';

  // Get references to the buttons and card elements
  const monthlyButton = document.querySelector('#monthlyButton');
  const biannuallyButton = document.querySelector('#biannuallyButton');
  const annuallyButton = document.querySelector('#annuallyButton');

  // Add event listeners to the buttons
  monthlyButton.addEventListener('click', () => updatePrices('monthly'));
  biannuallyButton.addEventListener('click', () => updatePrices('biannually'));
  annuallyButton.addEventListener('click', () => updatePrices('annually'));

  function updatePrices(subscriptionType) {
    currentType = subscriptionType;
    // console.log('updatePrices');
    // Loop over the plans
    updatedPlans.forEach((plan) => {
      const planID = plan.title;
      const priceElement = document.querySelector(`#${planID}Price`);
      const discountElement = document.querySelector(`#${planID}DiscPrice`);

      // Calculate prices based on subscription type
      const price = calculatePrice(plan, subscriptionType);
      const discountedPrice = calculateDiscountedPrice(plan, subscriptionType);

      // Update the price elements
      priceElement.textContent = `₹${price.toFixed(2)}`;
      discountElement.textContent = `₹${discountedPrice.toFixed(2)}`;
    });

    // Highlight the selected button
    highlightButton(subscriptionType);
  }

  function calculatePrice(plan, subscriptionType) {
    if (subscriptionType === 'monthly') {
      return plan.pricing.pricePerMo;
    } else if (subscriptionType === 'biannually') {
      return plan.pricing.pricePerMo * 6;
    } else if (subscriptionType === 'annually') {
      return plan.pricing.pricePerMo * 12;
    }
  }

  function calculateDiscountedPrice(plan, subscriptionType) {
    const price = calculatePrice(plan, subscriptionType);
    const discount =
      subscriptionType === 'monthly'
        ? 0
        : subscriptionType === 'biannually'
          ? plan.pricing.discounts.halfYearly
          : subscriptionType === 'annually'
            ? plan.pricing.discounts.yearly
            : 0;
    return price - (price * discount) / 100;
  }

  function highlightButton(subscriptionType) {
    const buttons = [monthlyButton, biannuallyButton, annuallyButton];

    buttons.forEach((button) => {
      if (button.id === `${subscriptionType}Button`) {
        button.classList.remove(
          'bg-transparent',
          'dark:hover:bg-gray-600',
          'hover:bg-gray-200'
        );
        button.classList.add('bg-gray-200', 'dark:bg-gray-700');
      } else {
        button.classList.remove('bg-gray-200', 'dark:bg-gray-700');
        button.classList.add(
          'bg-transparent',
          'dark:hover:bg-gray-600',
          'hover:bg-gray-200'
        );
      }
    });
  }

  // Function to show the modal
  function showModal(planName, planPrice, rzp1) {
    const modal = document.getElementById('razorpayModal');
    const planModal = document.getElementById('planModal');
    const priceModal = document.getElementById('priceModal');

    // Set the plan name and price in the modal
    planModal.textContent = planName;
    priceModal.textContent = `Price: ₹${planPrice.toFixed(2)}`;

    document.getElementById('rzp-button').onclick = function (e) {
      rzp1.open();
      e.preventDefault();
    };

    // Remove the 'hidden' class to show the modal
    modal.classList.remove('hidden');
  }

  // Function to hide the modal
  function hideModal() {
    document.getElementById('razorpayModal').classList.add('hidden');
  }

  updatedPlans.forEach((plan) => {
    const planID = plan.title;
    const planButton = document.querySelector(`#${planID}`);

    planButton.addEventListener('click', async function () {
      // Show the modal
      const title = plan.title;
      const price = calculateDiscountedPrice(plan, currentType);

      var data = null;
      const baseUrl = 'https://api.flux.codegasms.com/billing/create';

      try {
        const response = await fetch(baseUrl, {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            amount: price * 100,
            currency: 'INR',
            receipt: title,
          }),
        });
        // console.log(response.status);
        if (!response.ok) {
          // console.log(response.status);
          // console.log(response.statusText);
          alert('Could not create order! Make sure setup is correct');
        } else {
          data = await response.json();
          // console.log(data);
          console.log('end of flow');
        }
        // console.log(response.body);
      } catch (err) {
        console.log('error happened');
        // console.log(err);
        if (err?.response) {
          console.log(await err.response.json());
        }
      }
      // alert(`Order created: id: ${data.order.id}. Click on Pay with Razorpay`);

      var options = {
        key: data.key,
        amount: data.order.amount,
        // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: data.order.currency,
        name: 'Flux@Codegasms',
        description: 'Thank You For Ordering!',
        image: 'https://i.ibb.co/ZJG2pG2/download-7.jpg',
        order_id: data.order.id,
        callback_url: `https://api.flux.codegasms.com/${data.verifyUrl}?frontendBase=http://localhost:8000&successRedirect=/mods/success&failureRedirect=/mods/failure`,

        notes: {
          'custom-data': 'data',
        },
        theme: {
          color: '#3399cc',
        },
      };
      if (data.prefill) {
        options['prefill'] = data.prefill;
      }

      var rzp1 = new Razorpay(options);
      // document.getElementById('rzp-button1').onclick = function (e) {
      //   rzp1.open();
      //   e.preventDefault();
      // };

      showModal(title, price, rzp1);
    });
  });

  const modal = document.getElementById('razorpayModal');
  modal.addEventListener('click', (event) => {
    if (!event.target.closest('.modal-content')) {
      hideModal();
    }
  });
};
