// DetailedInvoice.tsx - Fixed table column widths
import React from 'react';
import { motion } from 'framer-motion';

export interface InvoiceData {
  receiptNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  timeSlot: string;
  numberOfPeople: number;
  riders: number;
  photoPackage: boolean;
  goProPackage: boolean;
  tshirts: number;
  tipAmount?: number;
  paymentAmount: number;
  paymentDate: string;
  paymentMethod: string;
  cardLast4: string;
}

const DetailedInvoice: React.FC<{ invoiceData: InvoiceData }> = ({ invoiceData }) => {
  // Calculate individual line items with new pricing structure
  const parasailingUnitPrice = invoiceData.numberOfPeople >= 2 ? 75 : 89;
  const parasailingCost = invoiceData.numberOfPeople * parasailingUnitPrice;
  const ridersCost = invoiceData.riders * 30;
  const photoCost = invoiceData.photoPackage ? 30 : 0;
  const goproCost = invoiceData.goProPackage ? 30 : 0;
  const tshirtCost = invoiceData.tshirts * 50;
  const tipCost = (invoiceData.tipAmount || 0) / 100;
  
  const subtotal = parasailingCost + ridersCost + photoCost + goproCost + tshirtCost + tipCost;

  const formatReservationDate = (isoDateTimeString: string) => {
    if (!isoDateTimeString) return "Date not available";
    
    try {
      const date = new Date(isoDateTimeString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting reservation date:", error);
      return "Date not available";
    }
  };

  const formatReservationTime = (isoDateTimeString: string) => {
    if (!isoDateTimeString) return "Time not available";
    
    try {
      const date = new Date(isoDateTimeString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Error formatting reservation time:", error);
      return "Time not available";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-6">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern
              id="invoice-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="8" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#invoice-pattern)" />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Big Sky Parasail</h1>
              <p className="text-blue-100 mt-1">Flathead Lake Adventures</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <p className="text-sm text-blue-100">Receipt #</p>
                <p className="text-lg font-bold">{invoiceData.receiptNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary Bar */}
      <div className="bg-green-50 border-l-4 border-green-400 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-green-800 font-semibold">Payment Successful</p>
              <p className="text-green-600 text-sm">Paid on {new Date(invoiceData.paymentDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-800">${(invoiceData.paymentAmount / 100).toFixed(2)}</p>
            <p className="text-green-600 text-sm">{invoiceData.paymentMethod} •••• {invoiceData.cardLast4}</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Customer & Reservation Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Customer Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="font-medium text-gray-900">{invoiceData.customerName}</p>
              <p className="text-gray-600 flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {invoiceData.customerEmail}
              </p>
              <p className="text-gray-600 flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {invoiceData.customerPhone}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Reservation Details
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">{formatReservationDate(invoiceData.reservationDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium text-gray-900">{formatReservationTime(invoiceData.reservationDate)}</span>
              </div>
              <div className="pt-2 border-t border-blue-200">
                <p className="text-sm text-blue-700 font-medium">
                  Please arrive 15 minutes before your scheduled time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Services - FIXED TABLE */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Services Booked
          </h3>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Qty</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Rate</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Parasailing */}
                  <tr>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Parasailing Experience</div>
                          <div className="text-sm text-gray-500">
                            Premium parasailing adventure
                            {invoiceData.numberOfPeople >= 2 && (
                              <span className="text-green-600 font-medium ml-2">(Group rate applied!)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-900">{invoiceData.numberOfPeople}</td>
                    <td className="px-4 py-4 text-center text-sm text-gray-900 whitespace-nowrap">
                      {invoiceData.numberOfPeople >= 2 ? (
                        <div className="flex flex-col items-center">
                          <span className="line-through text-gray-400">$99.00</span>
                          <span className="text-green-600 font-medium">$75.00</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="line-through text-gray-400">$99.00</span>
                          <span className="text-green-600 font-medium">$89.00</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 whitespace-nowrap">${(parasailingCost).toFixed(2)}</td>
                  </tr>

                  {/* Other rows remain the same but with whitespace-nowrap on amount columns */}
                  {invoiceData.riders > 0 && (
                    <tr>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">Boat Riders</div>
                            <div className="text-sm text-gray-500">Non-parasailing passengers</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-900">{invoiceData.riders}</td>
                      <td className="px-4 py-4 text-center text-sm text-gray-900 whitespace-nowrap">$30.00</td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 whitespace-nowrap">${ridersCost.toFixed(2)}</td>
                    </tr>
                  )}

                  {invoiceData.photoPackage && (
                    <tr>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">Photo Package</div>
                            <div className="text-sm text-gray-500">Professional photos of your adventure</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-900">1</td>
                      <td className="px-4 py-4 text-center text-sm text-gray-900 whitespace-nowrap">$30.00</td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 whitespace-nowrap">$30.00</td>
                    </tr>
                  )}

                  {invoiceData.goProPackage && (
                    <tr>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">GoPro Video Package</div>
                            <div className="text-sm text-gray-500">First-person video of your experience</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-900">1</td>
                      <td className="px-4 py-4 text-center text-sm text-gray-900 whitespace-nowrap">$30.00</td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 whitespace-nowrap">$30.00</td>
                    </tr>
                  )}

                  {invoiceData.tipAmount && invoiceData.tipAmount > 0 && (
                    <tr>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">Crew Tip</div>
                            <div className="text-sm text-gray-500">Appreciation for exceptional service</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-900">1</td>
                      <td className="px-4 py-4 text-center text-sm text-gray-900 whitespace-nowrap">${tipCost.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 whitespace-nowrap">${tipCost.toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right text-base font-semibold text-gray-900">Total:</td>
                    <td className="px-6 py-4 text-right text-xl font-bold text-gray-900 whitespace-nowrap">${subtotal.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Mobile View - Stacked Cards */}
            <div className="md:hidden">
              {/* Parasailing Card */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">Parasailing Experience</h4>
                    <p className="text-sm text-gray-500">Premium parasailing adventure</p>
                    {invoiceData.numberOfPeople >= 2 && (
                      <p className="text-sm text-green-600 font-medium mt-1">Group rate applied!</p>
                    )}
                    <div className="mt-2 flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-600">Qty: {invoiceData.numberOfPeople}</span>
                        <span className="mx-2 text-gray-400">×</span>
                        {invoiceData.numberOfPeople >= 2 ? (
                          <span className="text-sm">
                            <span className="line-through text-gray-400">$99</span>
                            <span className="text-green-600 font-medium ml-1">$75</span>
                          </span>
                        ) : (
                          <span className="text-sm">
                            <span className="line-through text-gray-400">$99</span>
                            <span className="text-green-600 font-medium ml-1">$89</span>
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-gray-900">${parasailingCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional services cards would go here with similar mobile-friendly layout */}
              
              {/* Total */}
              <div className="p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
          <h4 className="flex items-center text-amber-800 font-semibold mb-3">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Important Reservation Information
          </h4>
          <div className="text-amber-700 space-y-2 text-sm">
            <p>• Please arrive <strong>15 minutes before</strong> your scheduled time</p>
            <p>• Bring sunscreen, sunglasses, and a towel</p>
            <p>• Wear comfortable clothing and secure shoes</p>
            <p>• Weather conditions may affect your reservation - we'll contact you if changes are needed</p>
            <p>• Cancellation policy: 24-hour notice required for full refund</p>
            {invoiceData.tipAmount && invoiceData.tipAmount > 0 && (
              <p>• Thank you for your generous tip to our crew! 🚤</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-200 pt-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Questions? We're here to help!</h4>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8">
              <a 
                href="mailto:bigskyparasailing@gmail.com" 
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                bigskyparasailing@gmail.com
              </a>
              <a 
                href="tel:+14062706256" 
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (406) 270-6256
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailedInvoice;