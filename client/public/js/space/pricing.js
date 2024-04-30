const response = await fetch('http://localhost:3000/spaces/quotas', {
  method: 'GET',
  headers: {
    accept: 'application/json',
  },
});

const defaultPlans = [
  {
    quotaID: 'quota1',
    title: 'Basic',
    spaceGBs: 100,
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
    quotaID: 'quota2',
    title: 'Pro',
    spaceGBs: 200,
    summary: `Access all features\nUnlimited watchlists\nChat support\nOptimize hashtags\n10+ exclusive pro widgets`,
    pricing: {
      pricePerMo: 159.99,
      discounts: {
        halfYearly: 10,
        yearly: 20,
      },
    },
  },
  {
    quotaID: 'quota3',
    title: 'ProPlus',
    spaceGBs: 300,
    summary: `Access all features\nUnlimited watchlists\nChat support\nOptimize hashtags\n10+ exclusive pro widgets`,
    pricing: {
      pricePerMo: 259.99,
      discounts: {
        halfYearly: 15,
        yearly: 25,
      },
    },
  },
];
const responsePlans = await response.json();
// console.log(responsePlans);
const plans = responsePlans || defaultPlans;

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

const updatedPlans = updateFeaturesArray(plans);

window.onload = () => {
  // Get references to the buttons and card elements
  const monthlyButton = document.querySelector('#monthlyButton');
  const biannuallyButton = document.querySelector('#biannuallyButton');
  const annuallyButton = document.querySelector('#annuallyButton');

  // Add event listeners to the buttons
  monthlyButton.addEventListener('click', () => updatePrices('monthly'));
  biannuallyButton.addEventListener('click', () => updatePrices('biannually'));
  annuallyButton.addEventListener('click', () => updatePrices('annually'));

  function updatePrices(subscriptionType) {
    console.log('updatePrices');
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
};
