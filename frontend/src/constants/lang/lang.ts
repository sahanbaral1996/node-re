import subscription from './subscription';
import name from './name';
import email from './email';
import addon from './addon';
import setupPassword from './setupPassword';

export const en = {
  home: {
    TREATMENT_SUMMARY: 'your dashboard',
    DETAILED_TREATMENT_PLAN: 'your treatment details',
  },
  login: {
    WELCOME: 'Welcome to docent!',
    DESCRIPTION:
      'Please login with the email and temporary password provided in your registration email. You will be prompted to create a personalized (and easier to remember) password on the next screen.',
  },
  treatmentSummary: {
    title: "Here's what we are treating",
    subtitle: "Here's what we're treating:",
  },
  assessmentSummary: {
    TITLE: 'Change is the only constant',
    SUBTITLE: 'For continued progress, let’s stay in touch.',
    BODY:
      'Fine-tuning and tweaking your regimen yields the best results. Answer a few questions prior to your next shipment.',
    AVAILABLE_IN: 'Your next reassessment will be available in:',
    AVAILABLE_TODAY: 'Your reassessment is active from today.',
    UPDATE_US: 'UPDATE US',
  },
  challengesSummary: {
    TITLE: 'Stuff happens. We can help.',
    SUBTITLE: 'Facing any unexpected issues? We’re all ears.',
    BODY: 'Let us know what is going on and our team of experts will get back to you with a solution within 24 hours.',
    TALK_TO_US: 'Contact us',
  },
  planChart: {
    TITLE: 'The Plan',
    GOALS: 'goals',
    REGIMEN: 'regimen',
    PHOTOS: 'photos',
  },
  uploadPhoto: {
    TITLE: 'Upload your',
    PHOTO: 'photo',
    SELFIE: 'selfie',
    SHELFIE: 'shelfie',
    FACE_DESCRIPTION:
      'Now for some “show” to go along with all you have told! Photos of your skin’s current state, combined with your assessment answers will give us everything we need to create your custom prescription and personalized plan.',
    REGIMEN_DESCRIPTION:
      "Topical reconciliation is an important part of your regimen creation, and one that is often skipped in the doctor's office! Our licensed estheticians will assess and give recommendations on up to 6 of your products to support the creation a cohesive regimen.",
  },
  uploadImage: {
    ADD_PHOTO: 'ADD MORE PHOTOS',
    TITLE: 'Click here to upload 3-5 face photos of the following angles, and any close-ups of blemish areas:',
  },
  uploadStepBody: {
    PRIVACY_POLICY: 'Your photos are never shared elsewhere and are protected by Privacy Policy.',
    PHOTO_ACCEPTANCE: '.jpg file under 5 megabytes accepted.',
    SKIP: 'Skip step',
    SAMPLE_PHOTO: 'See sample photos',
  },
  uploadFace: {
    TITLE_SEGMENT1: 'Upload 3-5',
    TITLE_SEGMENT2: 'makeup free face photos ',
    TITLE_SEGMENT3: 'of the following angles, and any close-ups of concern areas:',
    BUTTON_TEXT: 'Continue and submit photos',
  },
  uploadSkinCareProduct: {
    TITLE_SEGMENT1: 'Upload 3 - 5 photos of the',
    TITLE_SEGMENT2: 'skincare products (e.g. cleanser, toner, sunscreen, moisturizer, serum, exfoliant)',
    TITLE_SEGMENT3: 'you’re currently using',
    BUTTON_TEXT: 'Continue and submit photos',
  },
  userRegistration: {
    TITLE: 'Fantastic, you are eligible!',
    SUBTITLE:
      'To get your custom formula just right, we will be asking you a series of questions. Let’s set up your personal account so we can save your answers.',
    FOOTERQUESTIONS: 'Questions? ',
    FOOTERCHECKOUT: 'Check out our ',
    FOOTERLINK: 'support page',
    EMAIL: {
      LABEL: 'Your email address',
      PLACEHOLDER: 'eg. you@example.com',
    },
    FIRST_NAME: {
      LABEL: 'Your first name',
      PLACEHOLDER: 'eg. Stella',
    },
    LAST_NAME: {
      LABEL: 'Your last name',
      PLACEHOLDER: 'eg. Gurbner',
    },
    DUPLICATE_EMAIL: {
      MESSAGE: 'The email you provided is already registered. Sign up with another email or',
    },
    BIRTHDAY: {
      LABEL: 'Your birthday',
      PLACEHOLDER: 'MM/DD/YYYY',
    },
    HOME_STATE: {
      LABEL: 'Your home state',
      PLACEHOLDER: 'Please select',
    },
    PHONE: {
      LABEL: 'Phone',
      PLACEHOLDER: 'eg. (555) 555-1234',
      TOOLTIP: 'Your phone number is required so that our pharmacy team can reach out with any clinical questions.',
    },
    AGE_WARNING: {
      TITLE: 'As much as we’d like to help, docent is for adults 18 years and older!',
      DESCRIPTION:
        'Our products contain ingredients that are not appropriate for those under 18 but join our mailing list and we will reach out when you are eligible.',
    },
    REGION_WARNING: {
      TITLE: 'We’re not in your area yet, but we’ll be there soon!',
      DESCRIPTION:
        'Thank you for your interest in docent. We are currently not available in your area but join our mailing list to be the first to know when we expand into new states.',
    },
    TERMS_OF_SERVICE: {
      PRIVACY_LINK_TEXT_PREFIX: 'I agree to ',
      PRIVACY_LINK_TEXT: 'Privacy Policy',
      PRIVACY_LINK_TEXT_SUFFIX: 'and ',
      TERMS_OF_SERVICE_LINK_TEXT: 'Terms of Service',
      TERMS_OF_PRIVACY_PRACTICE: 'Privacy Practice',
    },
    NEWSLETTER: {
      LABEL: 'I agree to receive marketing email communications. ',
    },
    PRODUCT_DESCRIPTION: {
      TITLE: 'First month of The Essential Treatment is on us!',
      SUBTITLE_ONE: 'After one-time dermatology evaluation and curation fee of $20.',
      SUBTITLE_TWO: 'Free shipping forever.',
    },
    REGISTRATION_COMPLETED: {
      DESC: 'A new user has been registered with the following details',
      HEADER: 'User Registered',
    },
  },
  eligibility: {
    TITLE: 'Welcome to the first step in your journey to perfect skin. Your docent awaits!',
    SUBTITLE:
      'Let’s see if we are available in your state, and how old you are. For medical reasons knowing your real age is important, so please be honest.',
  },
  registrationForm: {
    TITLE: 'User Registration',
    UPDATE: 'Update User',
    SUBTITLE: 'Personal Information',
    FIRST_NAME: 'eg. Stella',
    LAST_NAME: 'eg. Gurbner',
    EMAIL_PLACEHOLDER: 'eg. you@example.com',
    BIRTHDAY: {
      LABEL: 'Your birthday',
      PLACEHOLDER: 'MM/DD/YYYY',
    },
  },
  medication: {
    specificMedication: {
      LABEL: 'Please elaborate...',
      PLACEHOLDER: 'e.g. retinoids, hydrators',
    },
    opposedToAnyMedication: {
      TITLE: 'Are you opposed to any medications? Why?',
      LABEL: 'Please elaborate...',
      PLACEHOLDER: 'e.g. oral medications',
    },
    oralMedication: {
      TITLE: 'Are you open to being prescribed an oral medication?',
      LABEL: 'Please elaborate...',
      PLACEHOLDER: '',
    },
  },
  checkWithDetail: {
    LABEL: 'Please describe the specific product you are using and how your skin reacts',
    PLACEHOLDER: '',
  },
  topicalRetinoid: {
    stillUsing: {
      TITLE: 'Are you still using a retinoid?',
    },
    specificProduct: {
      LABEL: 'What specific product did you use?',
      PLACEHOLDER: 'e.g. I was on prescription tretinoin 0.05%; I am using 0.5% over the counter Retinol',
    },
    skinToleration: {
      LABEL: 'How well did your skin tolerate it?',
      PLACEHOLDER: 'e.g. I had some redness, but it was tolerable and resolved within a few weeks',
    },
    dosage: {
      LABEL: 'What was the dosage amount?',
      PLACEHOLDER: 'e.g. 0.05%, 0.01%',
    },
  },
  menstrualPeriod: {
    NO_LABEL: 'I do not get menstrual periods because:',
    LABEL: 'Please elaborate...',
    PLACEHOLDER: '',
    PREGNANT_WARNING: {
      TITLE: 'First of all, congratulations on your pregnancy!',
      SUBTITLE: "We'd love to engage with you after your pregnancy, but at this time our service is not for you.",
    },
  },
  billing: {
    TITLE: 'Almost done.',
    BODY:
      'Just a few more steps and a quick photo upload and then one of our dermatologists will start designing your custom regimen.',
    BUTTON: 'Set up subscription',
  },
  signIn: {
    TITLE: 'Sign In',
    EMAIL_PLACEHOLDER: 'you@example.com',
    PASSWORD_PLACEHOLDER: '*********',
    FORGOT_PASSWORD: 'Forgot password?',
  },
  assessmentComplete: {
    TITLE: 'That’s a wrap!',
    TEXT: ' Thanks for finishing your assessment. Please hang on while we take you to setup.',
  },
  header: {
    ACCOUNT_MENU_TEXT: 'My Account',
    LOG_OUT_TEXT: 'Log out',
    GET_STARTED: 'Get Started',
    LOGIN: 'Login',
    HOME: 'Home',
  },
  reassessment: {
    MEDICATION: {
      QUESTION: 'Please share your new medication.',
      DESCRIPTION: 'e.g. Oral contraceptives',
    },
    SKIN: {
      MAX_LABEL: 'I see vast improvements in my skin',
      MIN_LABEL: 'My skin has gotten worse',
    },
    EXPERIENCES: {
      QUESTION: 'Please share what type of changes you have recently experienced',
      LABEL: 'Please explain the recently experienced changes',
      DESCRIPTION: 'eg. diet change..',
    },
    UPLOAD: {
      TITLE: 'Photo progress',
      YOUR_FACE: 'Your face',
    },
  },
  forgotPassword: {
    TITLE: 'Forgot password',
    DESCRIPTION: 'We will send you an email with reset instructions.',
    BACK_BUTTON_LABEL: 'Back to sign in',
  },
  resetPassword: {
    TITLE: 'Reset password',
    DESCRIPTION: 'Enter your new password along with the verification you received via email',
    SUCCESS_TITLE: 'Success',
    SUCCESS_MESSAGE: 'Password changed successfully',
    CODE_LABEL: 'Verification Code',
    PASSWORD_LABEL: 'New Password',
    CONFIRM_PASSWORD_LABEL: 'Confirm Password',
    PASSWORD_PLACEHOLDER: '********',
    RESET_BUTTON_LABEL: 'Reset Password',
    BACK_BUTTON_LABEL: 'Back to sign in',
    CODE_PLACEHOLDER: '123456',
  },
  createPassword: {
    TITLE: 'Create your password',
    DESCRIPTION:
      'This will allow you to save your assessment answers, receive your treatment results, and manage your account.',
    PASSWORD: 'Password',
    PASSWORD_PLACEHOLDER: '********',
    CONFIRM_PASSWORD: 'Confirm password',
  },
  orderFeedback: {
    TITLE: 'We are here to help',
    SUCCESS_TITLE: 'Thank you',
    SUCCESS_MESSAGE: 'We have successfully recorded your query.',
    DESCRIPTION_PLACEHOLDER: 'Please let us know what is going on',
    DESCRIPTION_ERROR: 'Description is required',
    UPLOAD_TITLE: 'Select face photos to upload',
    UPLOAD_SUBTITLE: 'Please upload .jpg photos under 3 megabytes in size.',
    UPLOAD_SUBTITLE_LINE_2: ' For good results, look towards a bright light source and hold your head steady.',
  },
  Review: {
    TITLE: 'Share your docent experience',
    DESCRIPTION:
      'Your feedback is important to us to continue to make the Docent experience the best it can be. We would love it if you could leave us a review on our site.',
    RATING_QUESTION: 'How would you rate your docent experience and products?',
    RATING_ERROR: 'Please provide a rating.',
    RECOMMEND_QUESTION: 'Would you recommend docent?',
    RECOMMEND_ERROR: 'Please choose an option.',
    YOUR_EXPERIENCE_LABEL: 'What has been your experience so far? ',
    YOUR_EXPERIENCE_PLACEHOLDER:
      'How did you find out about docent? How has your skin changed since starting our prescription treatments? Have you had good/bad/neutral interaction(s) with our docent care team?',
    YOUR_EXPERIENCE_ERROR: 'Please provide your experience.',
    UPLOAD_IMAGE_TITLE: 'Snap a selfie (or 2)',
    UPLOAD_IMAGE_DESCRIPTION:
      'We’d love to see your skin’s progress. Upload a recent photo of your skin and we’ll create a side by side comparision for you from the start of your docent journey to today.',
    DISCLAIMER:
      'By uploading images you are contenting to the use of these images in promotional or marketing materials.',
    FAB_REVIEW_TOOLTIP: 'Loving docent? Leave a review.',
  },
  orderReviewEditDialog: {
    TITLE:
      'We know that finding the right regimen is key so  are committed to getting figuring out exactly what you need.',
    QUESTION: 'Please let us know what you would like to see different in your first formulation',
    BUTTON_TEXT: 'Send Feedback',
    TEXT_AREA_TITLE: 'What specific product and concentration did you use?',
    TEXT_AREA_PLACEHOLDER: 'eg. Afaxin 0.012%',
    SUCCESS_TITLE: 'Success',
    SUCCESS_MESSAGE: 'We have successfully updated the order review.',
    BUTTON_CANCEL_TEXT: 'Cancel',
  },
  orderConfirmed: {
    TITLE: 'Your plan will be available in a few days.',
    DESCRIPTION:
      'Now that we know more about you, our expert team will review your responses over the next 48 hours to create your custom, prescription regimen.',
  },
  orderOnHold: {
    TITLE: 'Your plan is currently bring revised.',
    DESCRIPTION:
      'Our team is reviewing your comments on your first custom formula and adjusting your plan accordingly. We will send you an email with your updated formula to review shortly!',
  },
  orderReview: {
    REGIMEN: 'Regimen #1',
    TITLE: 'Your custom blends',
    SUB_TITLE: 'Your unique docent prescription contains the following:',
    LEARN_MORE: 'Learn More',
    MAKE_EDITS: 'No, I want to change something',
    ACCEPT: "Yes, let's go!",
    SUCCESS_TITLE: 'Success',
    ORDER_APPROVE_SUCCESS: 'Order has been approved.',
    LOOKS_GOOD: 'Looks good? ',
    LOOKS_GOOD_MESSAGE:
      'Awesome! Accept your plan now and check out your 12 month treatment plan while our team gets to work on sending your shipment!',
    HAVE_ISSUE: 'Have an issue or concern with this first formula?',
    HAVE_ISSUE_MESSAGE: 'Let us know below and we will work together to get you exactly what you need.',
    CONFIRMATION_TITLE: 'Ready to receive your first prescription?',
    CONFIRMATION_DETAIL:
      'Finding the right regimen is key so if you have an issue with any of the above proposed compounds, please let us know and we will make it right. Otherwise, we will get your first docent package in the mail!',
    NO_EDIT_MSG1: 'Order Review is',
    NO_EDIT_MSG2: 'You can not make edits.',
  },
  product: {
    TITLE: "It's time for our dermatologists to get to work.",
    DESCRIPTION1:
      'Now that we know more about you, our expert team will review your responses over the next 48 hours to create your custom, prescription regimen.',
    DESCRIPTION2:
      'You will have a chance to review your regimen before our pharmacy gets to work on compounding your one of a kind formula.',
  },
  plan: {
    REGIMEN_TILE: 'docent is a regimen',
    REGIMEN_DERMATOLOGIST:
      'Your docent dermatologist will be creating several components for you in response to your assessment.',
    REGIMENT_DETAILS: [
      'Custom 12-month plan to tackle all your stated skin conditions',
      'Personalized prescription formula with multiple active components',
      'Custom cleanser to support twice-daily delivery of active agents',
    ],
    SETUP_SUBSCRIPTION: 'Set up subscription',
    SUBSCRIPTION_TILE: 'Just pay the activation cost for the first month.',
    SUBSCRIPTION_DETAILS: [
      {
        TYPE: 'activation',
        TEXT: 'Receive your first month’s prescription for',
        COST: '$20',
        SUFFIX: 'shipping and handling',
      },
      {
        TYPE: 'billing',
        TEXT: 'Continue receiving your custom-tailored plan for',
        COST: '$49',
        SUFFIX: 'per month (bills and ships for $98 every two months)',
      },
    ],
    DOUBTS: 'Have doubts?',
    FAQ_LINK_TEXT: 'Read our FAQs',
    TESTIMONITALS_IMAGE_TILES: {
      PEOPLE: 'Real People.',
      RESULTS: 'Clear results.',
    },
    TESTIMONNIALS_IMAGE_DETAILS: {
      BEFORE: 'Before',
      AFTER: 'After',
    },
    TESTIMONIALS: {
      TEXT:
        'My experience with docent has been truly customized as opposed to other skincare services. They really took into account what I was asking for and, because of this, I have seen real results!',
      AUTHOR: 'Rachel S.',
    },
  },
  onHold: {
    HEADER: 'Order on Hold',
    BODY:
      'Your docent dermatologist has received your feedback on your first custom prescription. We are working to make any necessary adjustments right now and as soon as those tweaks are finalized, we will reach out via email with your revised plan! If you have any questions or additional feedback in the meantime, don’t hesitate to reach out to our team at',
    SUPPORT_EMAIL: 'support@docentrx.com',
  },
  waitConfirmModal: {
    TITLE: 'Your order is confirmed',
    SUBTITLE: 'We’re excited for you to begin your journey to ultimate skin confidence.',
    BODY: 'You will receive an email with your order confirmation and next steps shortly.',
    SPAM_INFO: 'Since this is your first email from us, please check your spam folder if you do not receive it!',
    LOGOUT: 'Return to docentrx.com',
  },
  reUploadPhoto: {
    TITLE_SEGMENT1: 'Upload 3-5',
    TITLE_SEGMENT2: 'makeup free face photos ',
    TITLE_SEGMENT3: 'of the following angles, and any close-ups of blemish areas:',
    TITLE: 'Upload your',
    FACE: '"face"',
    PHOTOS: 'photos',
    UPLOAD_FOOTER: 'Your photos are never shared elsewhere and are protected by Privacy Policy.',
    UPLOAD_INFO: ' .jpg file under 5 megabytes accepted ',
    UPLOAD_BUTTON: 'Upload',
    SUCCESS_TITLE: 'Success',
    SUCCESS_BODY: 'Photos successfully added.',
  },
  orderReviewFeedback: {
    TITLE: 'Please tell us how we can make it better.',
    SUBTITLE:
      'We know that finding the right regimen is key so are committed to getting figuring out exactly what you need.',
    TEXT_AREA_PLACEHOLDER: 'Let us know what you would like to see different in your first formulation,',
  },
  orderApproveMessage: {
    TITLE: 'Healthy skin lies ahead',
    SUBTITLE: 'Thank you for confirming your prescription.',
    QUESTION: 'What happens next?',
    BTN_MESSAGE: 'Okay',
    DESCRIPTION: 'The first formula in your regimen will be shipped to you in 3 days.',
  },
  orderFeedbackDetails: {
    TITLE: 'Thanks for the feedback',
    DESCRIPTION1:
      'Your docent dermatologist has received your feedback on your first custom prescription. We are working to make any necessary adjustments right now and as soon as those tweaks are finalized, we will reach out via email with your revised plan!',
    DESCRIPTION2:
      'If you have any questions or additional feedback in the meantime, don’t hesitate to reach out to our team at ',
    SUPPORT_EMAIL: 'support@docentrx.com',
    BTN_MESSAGE: 'Okay',
  },
  personalizedSolution: {
    TITLE: 'Your personalized solution for:',
    STAY_IN_TOUCH: 'For continued progress, staying in touch is key.',
    MESSAGE: 'Understanding how your skin is responding helps us fine-tune your regimen.',
    NEXT_ASSESSMENT_TIME: 'Time until next assessment',
    REASSESSMENT_DUE: 'Reassessment due',
    REASSESSMENT_DATE_UNAVAILABLE: 'Information about your next assessment will be provided here shortly.',
    NOW: 'Now',
  },
  yourPlan: {
    TITLE: 'Your Plan',
    CHALLENGES: 'Facing any challenges?',
    GET_IN_TOUCH: 'Get in touch',
    GOALS_TITLE: 'Notes from your docent',
    REGIMEN_TITLE: 'Regimen',
    GUIDANCE_TITLE: 'Guidance',
    DISCOVER_MORE: 'Discover your personalized content',
    LIFE_STYLE_GUIDANCE: 'Lifestyle guidance',
    MAKING_MOST: 'Treatment insights',
    MAKING_MOST_DETAIL_TITLE: 'Treatment insights',
    GUIDANCE_ADJUSTMENT: 'Adjustment period',
    GUIDANCE_APPLICATION: 'Application',
    SUN_SCREEN: {
      TITLE: 'The importance of sunscreen',
      IMPORTANCE: {
        TITLE: 'Why is sunscreen important',
        CONTENT_LIST: [
          'Rain or shine, indoors or not, sunscreen is nonnegotiable with prescription strength skincare. To get the most of your treatment and help the conditions we are treating it is imperative to wear sunscreen every day - whether you go outside or not.',
          'UV rays from the sun and tanning beds, and blue light emitted from electronic devices can penetrate and damage the skin. Aside from causing cancer, UV and blue light exposure is aging and counterproductive to our aim of improving your skin.',
          'Tretinoin and acids that treat aging, acne, sun damage and hyperpigmentation work their magic by thinning the skin, revealing new, fresher skin. This makes skin more vulnerable to UV rays and blue light, making daily use of sunscreen with a SPF30+ a must!',
        ],
      },
      APPLICATION: {
        TITLE: 'How to use',
        CONTENT_LIST: [
          'Apply a broad spectrum SPF 30+ sunscreen or higher daily.',
          'Apply about three pumps or the equivalent of 1/2 - 1 teaspoon to the face and neck. (For head to toe protection, up the quantity to 1 oz., roughly the size of a shot glass, and be sure to cover the chest, ears, back of neck!) With sprays, apply until an even sheen appears on the skin.',
          'With chemical sunscreens, allow 20-30 minutes before heading out to allow them to absorb.',
          'Reapply every two hours, and after sweating and swimming, as sunscreens degrade with light exposure.',
          'Wear a wide-brimmed hat and sunglasses for extra protection when outdoors. ',
          'Treat your skin like you would a baby’s. As you restore your skin, going outside without SPF is like putting a baby in the sun without sun protection. You simply wouldn’t do it!  Avoid the sun when possible, seek shade and wear protective clothing for added insurance.',
        ],
      },
      PRODUCT_OPTIONS: {
        TITLE: 'Product Options',
        FIRST_PARAGRAPH:
          'There are mineral and chemical sunscreen options available in creams, powders sprays, oils and towelettes, tinted and clear formulas.',
        SECOND_PARAGRAPH:
          'We recommend you find the type that you love to help you stick with it. Here are some to look for:',
        CONTENT_LIST: [
          {
            TITLE: 'Mineral sunscreens',
            DETAILS:
              'Zinc oxide and Titanium dioxide work as physical barriers, reflecting UVA and UVB rays. Zinc oxide provides better broad spectrum protection with more defense against UVA (aging) rays and is ideal for sensitive skin and acne. Choose micronized or tinted formulas with iron oxides to overcome the thick texture and whitish cast.',
          },
          {
            TITLE: 'Chemical sunscreens',
            DETAILS:
              'This type absorbs UV light, turning it into energy. Avobenzone with oxybenzone work well together for UVA/UVB protection, with Mexoryl SX deemed to be more photo stable than most forms.Discontinue use of other topical medications (benzoyl peroxide, retinoids or retinols). ',
          },
        ],
      },
      TIPS: {
        TITLE: 'Tips and facts',
        CONTENT_LIST: [
          "Don't use separated or expired sunscreens. Toss if it is over a year old as it will be less effective, especially when exposed to heat.",
          "Don't think that sunscreen in your makeup will provide adequate protection",
          'Discard formulas with oxybenzone and octinoxate found to be harmful and endanger coral reefs.',
        ],
      },
    },
    PHOTOS: 'Photos',
  },
  photoViewer: {
    ZOOM_IN: 'Zoom in',
    ZOOM_OUT: 'Zoom out',
  },
  genderAssessment: {
    textBox: {
      PLACEHOLDER: '',
      LABEL: 'Please elaborate',
    },
  },
  allergyQuestion: {
    TITLE: 'Being aware of any medication or food allergies will help us avoid an allergic reaction.',
    MUSHROOM: 'Are you allergic to mushrooms or nuts?',
    MEDICATIONS: 'Are you allergic to any medications?',
    MEDICATIONS_PLACEHOLDER: 'e.g. I am allergic to penicillin resulting in hives; eating peanuts trigger anaphylaxis',
    MEDICATION_LABEL: 'Please provide details about your allergy',
  },
  skinType: {
    TYPE: 'How would you describe your skin on the spectrum of dry to oily?',
    PRODUCTS: 'How does your face tend to respond to skincare products?',
  },
  account: {
    SETTINGS: 'Settings',
    SELECT_TOPIC: 'Please select a topic.',
    USER_INFORMATION: 'Personal Information',
    nav: {
      ACCOUNT: 'Account',
      SUBSCRIPTION: 'Manage Subscription',
      PRODUCT_SELECTION: 'Manage Product Selection',
      EMAIL: 'Email address',
      PASSWORD: 'Password',
      LOGOUT: 'Logout',
      LEAVE_REVIEW: 'Leave a Review',
    },
    email: {
      CHANGE_EMAIL: 'Update email address',
      LABEL: 'New email address',
      PLACEHOLDER: 'eg. sierramanker@gmail.com',
      PASSWORD_LABEL: 'Current password',
      PASSWORD_PLACEHOLDER: '*********',
      CONFIRMATION: 'We will send you a confirmation email to verify your new email.',
      UPDATE_BTN: 'Update email',
      CHANGE_EMAIL_SUCCESSFUL: 'Email changed successfully.',
      CONFIRM_PASSWORD_PLACEHOLDER: 'Enter new password.',
    },
    password: {
      CHANGE_PASSWORD: 'Change Password',
      CURRENT_PASSWORD_LABEL: 'Current password',
      CURRENT_PASSWORD_PLACEHOLDER: '*********',
      NEW_PASSWORD_LABEL: 'New password',
      NEW_PASSWORD_PLACEHOLDER: 'Enter new password',
      CONFIRM_PASSWORD_LABEL: 'Confirm new password',
      CONFIRM_PASSWORD_PLACEHOLDER: 'Enter new password',
      CHANGE_BTN: 'Change password',
      CHANGE_PASSWORD_SUCCESSFUL: 'Password changed successfully.',
    },
  },
  fullStoryCusEvent: {
    REGISTRATION_STARTED: 'Registration Started',
    REGISTRATION_COMPLETED: 'Registration Completed',
    ACCOUNT_CREATED: 'Account Created',
    SETUP_SUBSCRIPTION: 'Subscription Started',
    PHOTO_UPLOAD: 'Photo Upload',
    ASSESSMENT_STARTED: 'Assessment Started',
  },
  subscription,
  addon,
  tagManagerCusEvent: {
    LEAD_CREATED: 'lead_created',
    DETAIL_RECORDED: 'user_detail_added',
    PHOTO_UPLOAD: 'photo_upload_completed',
    USER_REGISTERED: 'user_registered',
    ASSESSMENT_COMPLETED: 'assessment_completed',
    SUBSCRIPTION_SETUP: 'subscription_setup_completed',
  },
  loginIssues: {
    INVALID_EMAIL_PASSWORD: 'Incorrect email or password',
    NEW_LEAD: 'Looks like you haven’t created an account yet! Create your account',
  },
  name,
  passwordRequirement: {
    TITLE: 'To keep you account secure, make sure your password:',
    REQUIREMENTS: ['Is longer than 7 characters', 'Contains at least a number, a lowercase letter and a symbol'],
  },
  email,
  sampleImage: {
    HEADING: 'Sample Photos',
    FRONT_FACE_LABEL: 'Front facing without makeup',
    RIGHT_FACE_LABEL: 'Right facing without makeup',
    LEFT_FACE_LABEL: 'Left facing without makeup',
  },
  setupPassword,
  shoppingCart: {
    DISCLAIMER:
      'Your docent dermatologist will review your selection to ensure it is compatible with your skin type and concerns',
  },
  thankYouScreen: {
    TITLE: 'Thank you!',
    DESCRIPTION: 'Our team will make any necessary adjustments to your next formula based on your answers.',
    BUTTON: 'Go to Home',
  },
};
