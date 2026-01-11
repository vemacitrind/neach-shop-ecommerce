import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID_BUYER = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_BUYER;
const EMAILJS_TEMPLATE_ID_ADMIN = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMIN;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_MAIL;

if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export const sendOrderStatusEmail = async (
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  status: string,
  message?: string
) => {
  try {
    const templateParams = {
      to_email: customerEmail,
      to_name: customerName,
      order_number: orderNumber,
      status: status,
      message: message || `Your order ${orderNumber} status has been updated to ${status}.`,
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_BUYER,
      templateParams
    );
    
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};

export const sendAdminNotification = async (
  orderNumber: string,
  customerName: string,
  total: number
) => {
  try {
    const templateParams = {
      to_email: ADMIN_EMAIL,
      to_name: 'Admin',
      order_number: orderNumber,
      customer_name: customerName,
      total: total,
      message: `New order ${orderNumber} received from ${customerName} for $${total}`,
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ADMIN,
      templateParams
    );
    
    return { success: true };
  } catch (error) {
    console.error('Admin notification failed:', error);
    return { success: false, error };
  }
};