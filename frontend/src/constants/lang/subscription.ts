export default {
  FORM: {
    ERRORS: {
      TITLE: 'Unfortunately there was an error while confirming your subscription',
      SUB_TITLE: 'Some of the most common reasons for this are:',
      REASONS: [
        'You may have entered your credit card or address details incorrectly',
        'You may have insufficient funds on your credit card',
      ],
      MESSAGE: 'Please try again',
    },
    HEADER:
      'To receive your expert evaluation and first month’s prescription, complete your shipping and billing information below.',
    SHIPPING_ADDRESS_HEADER: 'Shipping address',
    BILLING_ADDRESS_HEADER: 'Billing address',
    CREDIT_CARD_HEADER: 'Credit card',
    ADDRESS: {
      LINE_ONE: {
        LABEL: 'Address 1',
        PLACEHOLDER: 'e.g 123 street',
      },
      LINE_TWO: {
        LABEL: 'Address 2 (optional)',
        PLACEHOLDER: 'e.g 456 street',
      },
      CITY: {
        LABEL: 'City',
        PLACEHOLDER: 'e.g Face vil',
      },
      STATE: {
        LABEL: 'State',
      },
      ZIP: {
        LABEL: 'Zip Code',
        PLACEHOLDER: 'e.g 97080',
      },
      BILLING_SAME_AS_BILLING: {
        LABEL: 'My billing address is same as shipping address',
      },
    },
    CREDIT_CARD: {
      CARD: {
        LABEL: 'Credit card number',
        PLACEHOLDER: '#### #### #### ####',
      },
      EXPIRATION_DATE: {
        LABEL: 'Expiration date',
        PLACEHOLDER: 'MM/YY',
      },
      CVV: {
        LABEL: 'CVV',
        PLACEHOLDER: '###',
      },
    },
    PHONE: {
      HEADER: 'Contact Details',
      LABEL: 'Phone',
      PLACEHOLDER: 'eg. (XXX) XXXX-XXX',
      TOOLTIP: 'Your phone number is requested so that our pharmacy team can reach out with any clinical questions.',
    },
    COUPON: {
      HEADER: 'Have a promo code? Apply here',
      PLACEHOLDER: 'e.g. ESNBV',
      LABEL: 'Promo code',
      BUTTON_LABEL: 'Apply code',
      APPLIED_COUPON_HEADER: 'You’ve applied the promo code:',
      REMOVE_BUTTON_LABEL: 'Remove',
      INVALID_COUPON_MESSAGE: 'The promo code you’ve entered is invalid. Please try again.',
      INVALID_COUPON_TOAST_MESSAGE: 'The promo code you’ve entered is invalid.',
      TOAST_TITLE: 'Invalid promo code',
    },
    SUBMIT_BUTTON_LABEL: 'Claim my free trial',
    ADMIN_SUBMIT_BUTTON_LABEL: 'Confirm',
    BEFORE_AFTER_BLOCK: {
      HEADER: 'See results in as little as 6 weeks!',
      CAPTION_BEFORE: 'Before',
      CAPTION_AFTER: 'After 8 weeks',
      SUBHEADING: 'Reduced hyperpigmentation & improved texture',
      REVIEW:
        '"The products are totally customized, high quality, very effective, and just show up at my house!" - Teera',
      ZOOM: 'click to zoom in',
    },
    GUARANTEE_BLOCK: {
      TITLE: '90-day money-back guarantee',
      FIRST_LINE: 'We guarantee satisfaction when docent is properly used.',
      SECOND_LINE:
        'As it takes 2 months to see initial impact, if your skin condition is not improved to your satisfaction after proper usage after 60 days, we will refund the medication cost.',
      THIRD_LINE: {
        PREFIX: 'Terms and conditions apply, see our',
        FAQ: 'FAQ',
        SUFFIX: 'for details.',
      },
    },
  },
  ORDER_SUMMARY: {
    TRIAL_ORDER: {
      HEADER: 'Purchase summary',
      SUBHEADER: '1-month supply of your personalized prescription formula AND custom medicated wash',
      PLUS_HEADER: 'Plus...',
      PLUS_ITEMS: ['Personalized notes from docent', '12-month skin treatment plan', 'Access to your personal portal'],
    },
    ACTIVE_ORDER: {
      HEADER: 'Subscription order summary',
      SUBHEADER1: '60-day regimen with up to',
      INGREDIENT_COUNT: '5',
      SUBHEADER2: 'active ingredients',
      PLUS_HEADER: 'Plus...',
      PLUS_ITEMS: ['Your beauty regimen analysis', 'Ongoing regimen refinement', 'A direct line to your docent'],
      DETAILS: 'The Essential Cream',
      SUBHEADER3: 'Bills and ships every 2 months',
      COST: '$70.00',
      PAYMENT_DUE: {
        DESCRIPTION: 'Payment due every 60 days',
        COST: '$20.00',
      },
    },
    SUBSCRIPTION_COST_ITEMS: [
      {
        DESCRIPTION: 'One-time Dermatologist evaluation',
        SUB_HEADER: '',
        COST: '$20.00',
        DESCRIPTION_CLASS: 'subscription-cost-description',
        COST_CLASS: '',
      },
    ],
    SUBSCRIPTION_BASE_ITEM: {
      DESCRIPTION: 'The Essential Treatment',
      SUB_HEADER: '',
      COST: '$35.00',
      DESCRIPTION_CLASS: 'subscription-cost-description',
      COST_CLASS: '',
    },
    SHIPPING_COST_ITEMS: [
      {
        DESCRIPTION: 'Trial subtotal',
        COST: '$20.00',
      },
    ],
    PAYMENT_DUE: {
      DESCRIPTION: 'Due today',
      COST: '$20.00',
      PRICE_WITHOUT_WASH: '$50.00',
      PRICE_WITH_WASH: '$59.00',
    },
    PAYMENT_DUE_MONTHLY: {
      DESCRIPTION: 'Ongoing monthly fee',
    },
    OTHER: {
      TAX: 'Taxes included.',
      DESCRIPTION: 'Bills and Ships every 2 months at ',
      RISK: '100% risk-free trial.',
      CANCEL: 'Cancel any time before next shipment.',
      ELIGIBLE: 'HSA/FSA eligible',
      TRIAL_EXPLANATION:
        'Following your trial, pay just $35 per month (prescription bills and ships every 2 months at $70).',
    },
    HSA_FSA: {
      TITLE: 'HSA/FSA',
      DESCRIPTION: 'Dummy Description',
    },
    TRIAL_REMAINING: {
      DAYS: `You have :getTrialRemainingDays days of trial left. After your trial expires,
                you’ll be moved to the Bills and ships every 2 months, shipping included plan.`,
    },
    SUBSCRIPTION_PAUSED: {
      TITLE: 'Oh no, your subscription is currently paused!',
      DESCRIPTION:
        'You can reactivate your docent account any time to continue your personalized prescription treatment plan',
      DESCRIPTION1: 'To reactivate please contact',
      DESCRIPTION2: '. and our customer support team will be happy to assist!',
      EMAIL_DESC: 'If you have any question regarding your past treatment history, our team can be reached at ',
    },
    SUBSCRIPTION_CANCELLED: {
      TITLE: 'Oh no, your subscription has been cancelled!',
      DESCRIPTION1: 'To reactivate please contact',
      DESCRIPTION2: '. and our customer support team will be happy to assist!',
      DESCRIPTION:
        'You can reactivate your docent account any time to continue your personalized prescription treatment plan',
      EMAIL_DESC: 'If you have any question regarding your past treatment history, our team can be reached at ',
    },
  },
};
