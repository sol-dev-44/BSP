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
  // Add-on fields
  photo_package?: boolean;
  go_pro_package?: boolean;
  tshirts?: number;
  tip_amount?: number;
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
    // 🚨 DEBUG: Show exactly where this function is being called from
    console.log("🚨 SMS FUNCTION CALLED FROM:", new Error().stack);
    
    // DEBUG: Log what data we're receiving
    console.log("🔍 SMS Debug - Received reservation data:", {
      customerName: reservation.customerName,
      photo_package: reservation.photo_package,
      go_pro_package: reservation.go_pro_package,
      tshirts: reservation.tshirts,
      riders: reservation.riders
    });

    // You can use Textbelt for free (1 text per day) or buy credits
    // Get your API key from textbelt.com (optional - can use 'textbelt' for free tier)
    const textbeltKey = Deno.env.get("TEXTBELT_API_KEY") || "textbelt";
    const alertPhoneNumber = Deno.env.get("ALERT_PHONE_NUMBER") || "406-270-6256";

    // Format the message
    const startTime = formatDateTime(reservation.timeSlot.start_time);
    
    // Build add-ons text
    const addOns = [];
    if (reservation.photo_package) addOns.push("Photo Package");
    if (reservation.go_pro_package) addOns.push("GoPro Package");
    if (reservation.tshirts && reservation.tshirts > 0) {
      const tshirtCount = typeof reservation.tshirts === 'string' 
        ? parseInt(reservation.tshirts, 10) 
        : reservation.tshirts;
      addOns.push(`${tshirtCount} T-shirt${tshirtCount > 1 ? 's' : ''}`);
    }
    
    console.log("🔍 SMS Debug - Add-ons found:", addOns);
    
    const addOnsText = addOns.length > 0 ? `\nAdd-ons: ${addOns.join(', ')}` : '';
    
    const message = `🎯 NEW RESERVATION!
👤 ${reservation.customerName}
📱 ${reservation.customerPhone}
👥 ${reservation.numberOfPeople} parasailer${reservation.numberOfPeople > 1 ? 's' : ''}${reservation.riders ? ` + ${reservation.riders} rider${reservation.riders > 1 ? 's' : ''}` : ''}
📅 ${startTime}${addOnsText}
💰 ${reservation.totalAmount ? (reservation.totalAmount / 100).toFixed(2) : '0'}`;

    console.log("🔍 SMS Debug - Final message:", message);

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
  
  // Build add-ons text for console log
  const addOns = [];
  if (reservation.photo_package) addOns.push("Photo Package");
  if (reservation.go_pro_package) addOns.push("GoPro Package");
  if (reservation.tshirts && reservation.tshirts > 0) {
    const tshirtCount = typeof reservation.tshirts === 'string' 
      ? parseInt(reservation.tshirts, 10) 
      : reservation.tshirts;
    addOns.push(`${tshirtCount} T-shirt${tshirtCount > 1 ? 's' : ''}`);
  }
  
  const addOnsText = addOns.length > 0 ? `\n🎁 Add-ons: ${addOns.join(', ')}` : '';
  
  console.log(`
🎯 NEW RESERVATION ALERT:
👤 Customer: ${reservation.customerName}
📧 Email: ${reservation.customerEmail}
📱 Phone: ${reservation.customerPhone}
👥 ${reservation.numberOfPeople} parasailer${reservation.numberOfPeople > 1 ? 's' : ''}${reservation.riders ? ` + ${reservation.riders} rider${reservation.riders > 1 ? 's' : ''}` : ''}
📅 Time: ${startTime}${addOnsText}
${reservation.totalAmount ? `💰 Amount: ${(reservation.totalAmount / 100).toFixed(2)}` : ''}
  `);
};