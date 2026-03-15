# Driver Application Form Setup (Formspree)

To receive driver applications with **resume attachments** and a professional confirmation message, use Formspree.

## Steps

1. Go to [formspree.io](https://formspree.io) and create a free account.
2. Click **+ New Form** and name it (e.g. "Driver Applications").
3. Copy your form endpoint (e.g. `https://formspree.io/f/xyzabc`).
4. Open `script.js` and paste your endpoint:

```javascript
const FORMSPREE_DRIVER_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
```

Replace `YOUR_FORM_ID` with your actual form ID from Formspree.

## What changes

- **With Formspree:** Applicants submit the form on the site, resumes are attached automatically, and they see: *"Thank you for your application. We have received it and will be reviewing your resume. We will be in touch soon."*
- **Without Formspree:** The form opens the applicant's email client with a pre-filled message. They must attach their resume manually before sending.
