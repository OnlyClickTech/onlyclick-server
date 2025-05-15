const roles = ['user', 'task', 'admin', 'contractor'];
const status = ['Pending', 'Confirmed', 'inProgress', 'Cancelled', 'Completed'];
const category = [
  'Electrician',
  'Plumber',
  'Cleaner',
  'Carpenter',
  'Painting',
  'AC',
];

const subCategory = {
  Electrician: {
    subcategories: {
      'Switches & Sockets': ['Installation', 'Repair'],
      'Fan Services': ['Installation', 'Repair'],
      'Wall/Ceiling Light': ['Installation', 'Repair'],
      Wiring: ['New Wiring', 'Repair Wiring'],
      'Doorbell & Security': ['Installation', 'Repair'],
      'MCB/fuse': ['Installation', 'Repair'],
      'Appliance Services': ['Installation', 'Repair'],
    },
  },
  Plumber: {
    subcategories: {
      'Tap & Mixer': ['Installation', 'Repair'],
      Toilet: ['Installation', 'Repair'],
      'Bath & Shower': ['Installation', 'Repair'],
      'Bath Accessories': ['Installation', 'Repair'],
      'Basin & Sink': ['Installation', 'Repair'],
      'Drainage & Blockage': ['Unclogging', 'Repair'],
      'Leakage & Connection': ['Repair'],
      'Water Tank & Motor': ['Installation', 'Repair'],
    },
  },
  Cleaner: {
    subcategories: {
      Packages: ['Royal', 'Premium', 'Basic'],
      'Bathroom Cleaning': ['Full Cleaning'],
      'Kitchen Cleaning': ['Full Cleaning'],
      'Mini Services': ['Dusting', 'Mopping'],
      'Car Cleaning': ['Interior Cleaning', 'Exterior Cleaning'],
      'Bike Cleaning': ['Full Cleaning'],
      'Sofa Cleaning': ['Deep Cleaning'],
      'Bathroom Deep Cleaning': ['Full Cleaning'],
    },
  },
  Carpenter: {
    subcategories: {
      'Furniture Repair': ['Repair', 'Polishing'],
      'New Furniture': ['Design', 'Build'],
    },
  },
  Painting: {
    subcategories: {
      Interior: ['Wall Painting', 'Ceiling Painting'],
      Exterior: ['Wall Painting'],
    },
  },
  AC: {
    subcategories: {
      Installation: ['AC installation', 'Installation with Rope'],
      Uninstallation: ['AC uninstallation', 'Uninstallation with Rope'],
      Cleaning: ['Deep Cleaning', 'Jet service cleaning'],
      'Repair & Maintenance': [
        'AC gas refill',
        'AC gas leak repair',
        'PCB board ordinary',
        'PCB board IPM',
      ],
      'Other Services': ['Book a visit'],
    },
  },
};

const otpEventsEnum = Object.freeze({
  BOOKING_CREATED: 'bookingCreated',
  SEND_OTP: 'sendOtp',
  OTP_VERIFIED: 'otpVerified',
  WORK_COMPLETED_VERIFICATION: 'workCompletedVerification',
});
module.exports =  { roles, status, category, subCategory, otpEventsEnum };