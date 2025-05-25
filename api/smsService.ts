// smsService.ts - Create this new file
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

// Load environment variables
await load({ export: true });

export interface ReservationAlert {
  customerName: string;
  numberOfPeople: number;
  riders?: number;
  timeSlot: {
    start_time: string;
    end_time: string;
  };
  customerEmail: string;
  customerPhone: string;
  totalAmount?: number;
}

// Format date and time for SMS
const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Denver' // Mountain Time for Colorado
  };
  return date.toLocaleDateString('en-US', options);
};

// Send SMS notification using Textbelt (much simpler than Twilio!)
export const sendReservationAlert = async (reservation: ReservationAlert): Promise<boolean> => {
  try {
    // You can use Textbelt for free (1 text per day) or buy credits
    // Get your API key from textbelt.com (optional - can use 'textbelt' for free tier)
    const textbeltKey = Deno.env.get("TEXTBELT_API_KEY") || "textbelt";
    const alertPhoneNumber = Deno.env.get("ALERT_PHONE_NUMBER") || "406-270-6256";

    // Format the message
    const startTime = formatDateTime(reservation.timeSlot.start_time);
    const totalPeople = reservation.numberOfPeople + (reservation.riders || 0);
    
    const message = `🎯 NEW RESERVATION!
👤 ${reservation.customerName}
📧 ${reservation.customerEmail}
📱 ${reservation.customerPhone}
👥 ${totalPeople} people (${reservation.numberOfPeople} parasailers${reservation.riders ? `, ${reservation.riders} riders` : ''})
📅 ${startTime}
${reservation.totalAmount ? `💰 ${(reservation.totalAmount / 100).toFixed(2)}` : ''}`;

    // Textbelt API call (much simpler than Twilio!)
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: alertPhoneNumber,
        message: message,
        key: textbeltKey
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log("✅ SMS alert sent successfully via Textbelt");
      return true;
    } else {
      console.error("❌ Textbelt SMS failed:", result.error);
      return false;
    }

  } catch (error) {
    console.error("❌ Error sending SMS alert:", error);
    return false;
  }
};

// Backup notification method (console log if SMS fails)
export const logReservationAlert = (reservation: ReservationAlert): void => {
  const startTime = formatDateTime(reservation.timeSlot.start_time);
  const totalPeople = reservation.numberOfPeople + (reservation.riders || 0);
  
  console.log(`
🎯 NEW RESERVATION ALERT:
👤 Customer: ${reservation.customerName}
📧 Email: ${reservation.customerEmail}
📱 Phone: ${reservation.customerPhone}
👥 Total People: ${totalPeople} (${reservation.numberOfPeople} parasailers${reservation.riders ? `, ${reservation.riders} riders` : ''})
📅 Time: ${startTime}
${reservation.totalAmount ? `💰 Amount: $${(reservation.totalAmount / 100).toFixed(2)}` : ''}
  `);
};


// // simpleSmSservice.ts - Much easier alternative to Twilio
// import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

// // Load environment variables
// await load({ export: true });

// export interface ReservationAlert {
//   customerName: string;
//   numberOfPeople: number;
//   riders?: number;
//   timeSlot: {
//     start_time: string;
//     end_time: string;
//   };
//   customerEmail: string;
//   customerPhone: string;
//   totalAmount?: number;
// }

// // Format date and time for SMS
// const formatDateTime = (isoString: string): string => {
//   const date = new Date(isoString);
//   const options: Intl.DateTimeFormatOptions = {
//     weekday: 'short',
//     month: 'short', 
//     day: 'numeric',
//     hour: 'numeric',
//     minute: '2-digit',
//     timeZone: 'America/Denver' // Mountain Time for Colorado
//   };
//   return date.toLocaleDateString('en-US', options);
// };

// // Send SMS using Textbelt (much simpler than Twilio!)
// export const sendReservationAlert = async (reservation: ReservationAlert): Promise<boolean> => {
//   try {
//     // You can use Textbelt for free (1 text per day) or buy credits
//     // Get your API key from textbelt.com (optional - can use 'textbelt' for free tier)
//     const textbeltKey = Deno.env.get("TEXTBELT_API_KEY") || "textbelt";
//     const alertPhoneNumber = Deno.env.get("ALERT_PHONE_NUMBER") || "406-270-6256";

//     // Format the message
//     const startTime = formatDateTime(reservation.timeSlot.start_time);
//     const totalPeople = reservation.numberOfPeople + (reservation.riders || 0);
    
//     const message = `🎯 NEW RESERVATION!
// 👤 ${reservation.customerName}
// 📧 ${reservation.customerEmail}
// 📱 ${reservation.customerPhone}
// 👥 ${totalPeople} people (${reservation.numberOfPeople} parasailers${reservation.riders ? `, ${reservation.riders} riders` : ''})
// 📅 ${startTime}
// ${reservation.totalAmount ? `💰 $${(reservation.totalAmount / 100).toFixed(2)}` : ''}`;

//     // Textbelt API call (much simpler than Twilio!)
//     const response = await fetch('https://textbelt.com/text', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         phone: alertPhoneNumber,
//         message: message,
//         key: textbeltKey
//       })
//     });

//     const result = await response.json();
    
//     if (result.success) {
//       console.log("✅ SMS alert sent successfully via Textbelt");
//       return true;
//     } else {
//       console.error("❌ Textbelt SMS failed:", result.error);
//       return false;
//     }

//   } catch (error) {
//     console.error("❌ Error sending SMS alert:", error);
//     return false;
//   }
// };

// // Backup: Send email instead of SMS
// export const sendEmailAlert = async (reservation: ReservationAlert): Promise<boolean> => {
//   try {
//     // Simple email using a service like EmailJS or similar
//     // For now, just log it
//     const startTime = formatDateTime(reservation.timeSlot.start_time);
//     const totalPeople = reservation.numberOfPeople + (reservation.riders || 0);
    
//     console.log(`
// 📧 EMAIL ALERT (SMS Backup):
// 🎯 NEW RESERVATION!
// 👤 Customer: ${reservation.customerName}
// 📧 Email: ${reservation.customerEmail}
// 📱 Phone: ${reservation.customerPhone}
// 👥 Total People: ${totalPeople} (${reservation.numberOfPeople} parasailers${reservation.riders ? `, ${reservation.riders} riders` : ''})
// 📅 Time: ${startTime}
// ${reservation.totalAmount ? `💰 Amount: $${(reservation.totalAmount / 100).toFixed(2)}` : ''}
//     `);
    
//     return true;
//   } catch (error) {
//     console.error("❌ Error sending email alert:", error);
//     return false;
//   }
// };

// // Backup notification method (console log if SMS fails)
// export const logReservationAlert = (reservation: ReservationAlert): void => {
//   const startTime = formatDateTime(reservation.timeSlot.start_time);
//   const totalPeople = reservation.numberOfPeople + (reservation.riders || 0);
  
//   console.log(`
// 🎯 NEW RESERVATION ALERT:
// 👤 Customer: ${reservation.customerName}
// 📧 Email: ${reservation.customerEmail}
// 📱 Phone: ${reservation.customerPhone}
// 👥 Total People: ${totalPeople} (${reservation.numberOfPeople} parasailers${reservation.riders ? `, ${reservation.riders} riders` : ''})
// 📅 Time: ${startTime}
// ${reservation.totalAmount ? `💰 Amount: $${(reservation.totalAmount / 100).toFixed(2)}` : ''}
//   `);
// };