document.addEventListener("DOMContentLoaded", () => {
  const activityList = document.querySelectorAll(
    ".cart-details__form-activity"
  );
  const addOnContainer = document.querySelector(
    ".cart-details__summary-addon-details-container"
  );
  const parkDropDown = document.querySelector(".park-selection-text");
  const parkDropDownList = document.querySelector(
    ".park-selection-dropdown__body-wrapper"
  );

  parkDropDown.addEventListener("click", (e) => {
    e.target.classList.toggle("park-selection-active");
  });

  parkDropDownList.addEventListener("click", (e) => {
    if (e.target.classList.contains("park-selection-dropdown__body-item")) {
      parkDropDown.textContent = e.target.textContent;
      parkDropDown.classList.remove("park-selection-active");
    }
  });

  activityList.forEach((activity) => {
    const activityName = activity.querySelector(
      ".cart-details__form-activity-name"
    ).textContent;
    const activityPrice = activity.querySelector(
      ".cart-details__form-activity-rate"
    ).textContent;
    const activityInput = activity.querySelector(
      ".cart-details__form-activity-input"
    );
    const activityDecrease = activity.querySelector(
      ".cart-details__form-activity-input-decrease"
    );
    const activityIncrease = activity.querySelector(
      ".cart-details__form-activity-input-increase"
    );

    activity.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target === activityDecrease) {
        decrease(activityInput, activity);
        addAddOn(activityInput, activityName, activityPrice);
        calculate();
      } else if (e.target === activityIncrease) {
        increase(activityInput, activity);
        addAddOn(activityInput, activityName, activityPrice);
        calculate();
      }
    });
  });

  if (addOnContainer) {
    calculate();

    addOnContainer.addEventListener("click", (e) => {
      if (
        e.target.classList.contains(
          "cart-details__summary-addon-details-delete"
        )
      ) {
        const wrapper = e.target.closest(
          ".cart-details__summary-addon-details-wrapper"
        );
        let inputToReset;
        activityList.forEach((activity) => {
          const activityName = activity.querySelector(
            ".cart-details__form-activity-name"
          ).textContent;
          if (
            activityName.trim() ===
            wrapper
              .querySelector(".cart-details__summary-addon-details-name")
              .textContent.trim()
          ) {
            inputToReset = activity.querySelector(
              ".cart-details__form-activity-input"
            );
          }
        });
        deleteAddOn(wrapper);
        resetInput(inputToReset);
        calculate();
      }
    });
  }
});

const toggleClass = (input, element) => {
  if (input instanceof HTMLElement && element instanceof HTMLElement) {
    try {
      const inputValue = Number(input.value);
      element.classList.toggle("added", inputValue > 0);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
};

const increase = (input, element) => {
  if (input instanceof HTMLElement && element instanceof HTMLElement) {
    try {
      const inputValue = Number(input.value);
      input.value = inputValue + 1;
      toggleClass(input, element);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
};

const decrease = (input, element) => {
  if (input instanceof HTMLElement && element instanceof HTMLElement) {
    try {
      const inputValue = Number(input.value);
      if (inputValue > 0) {
        input.value = inputValue - 1;
      }
      toggleClass(input, element);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
};

const addAddOn = (input, addonName, addonRate) => {
  const addOnContainer = document.querySelector(
    ".cart-details__summary-addon-details-container"
  );
  const addOns = addOnContainer.children;

  const foundAddOn = Array.from(addOns).find((addOn) => {
    const addOnName = addOn.querySelector(
      ".cart-details__summary-addon-details-name"
    )?.textContent;
    return addOnName?.trim() === addonName.trim();
  });

  if (foundAddOn) {
    const addOnCount = foundAddOn.querySelector(
      ".cart-details__summary-addon-details-count"
    );
    addOnCount.textContent = Number(input.value);
    return;
  }

  const addOnWrapper = document.createElement("div");
  const addOnNameElement = document.createElement("p");
  const addOnCountElement = document.createElement("p");
  const addOnDeleteElement = document.createElement("button");

  addOnWrapper.classList.add("cart-details__summary-addon-details-wrapper");
  addOnNameElement.classList.add("cart-details__summary-addon-details-name");
  addOnCountElement.classList.add("cart-details__summary-addon-details-count");
  addOnDeleteElement.classList.add(
    "cart-details__summary-addon-details-delete"
  );

  addOnNameElement.textContent = addonName.trim();
  addOnCountElement.textContent = Number(input.value);
  addOnCountElement.setAttribute("data-rate", Number(addonRate));

  addOnWrapper.appendChild(addOnNameElement);
  addOnWrapper.appendChild(addOnCountElement);
  addOnWrapper.appendChild(addOnDeleteElement);

  addOnContainer.appendChild(addOnWrapper);
};

const deleteAddOn = (addOn) => {
  addOn.remove();
};

const resetInput = (input) => {
  input.value = 0;
  toggleClass(input, input.closest(".cart-details__form-activity"));
};

const calculate = () => {
  const subTotal = document.querySelector(
    ".cart-details__summary-details-total-amount"
  );
  const total = document.querySelector(".cart-details__summary-payable-amount");
  const addOnList = document.querySelectorAll(
    ".cart-details__summary-addon-details-wrapper"
  );
  let totalCost = subTotal ? Number(subTotal.textContent.trim()) : 0;

  addOnList.forEach((addon) => {
    const addonCountElement = addon.querySelector(
      ".cart-details__summary-addon-details-count"
    );
    const addonRate = parseFloat(
      Number(addonCountElement.getAttribute("data-rate"))
    );
    const addonCount = parseFloat(Number(addonCountElement.textContent));
    totalCost += addonRate * addonCount;
  });

  const formattedTotalCost =
    totalCost % 1 === 0 ? totalCost.toFixed(0) : totalCost.toFixed(2);

  total.innerText = formattedTotalCost;
};
