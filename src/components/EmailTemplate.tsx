
import * as React from 'react';

interface EmailTemplateProps {
    customerName: string;
    tripDate: string;
    tripTime: string;
    partySize: number;
    totalAmount: number;
    addOns?: {
        photo_package?: number;
        gopro_package?: number;
        tip_amount?: number;
    };
}

function formatTime12(time: string): string {
    if (!time) return time;
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function formatDate(dateStr: string): string {
    if (!dateStr) return dateStr;
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    customerName,
    tripDate,
    tripTime,
    partySize,
    totalAmount,
    addOns,
}) => {
    const photoTotal = (addOns?.photo_package || 0) * 30;
    const goproTotal = (addOns?.gopro_package || 0) * 50;
    const tipTotal = addOns?.tip_amount || 0;
    const displayTime = formatTime12(tripTime);
    const displayDate = formatDate(tripDate);

    return (
        <div style={{ fontFamily: 'Georgia, serif', lineHeight: '1.6', color: '#3D2B1F', maxWidth: 600, margin: '0 auto' }}>
            {/* Header with retro Montana colors */}
            <div style={{ background: 'linear-gradient(135deg, #FF9500, #B8860B)', padding: 24, textAlign: 'center', borderRadius: '12px 12px 0 0' }}>
                <h1 style={{ color: '#FFFFFF', margin: '0 0 4px', fontFamily: 'Georgia, serif' }}>Booking Confirmed!</h1>
                <p style={{ color: '#FFD700', margin: 0, fontSize: 14, fontWeight: 'bold' }}>Parasail Flight</p>
            </div>

            {/* Retro stripe bar */}
            <div style={{ display: 'flex', height: 6 }}>
                <div style={{ flex: 1, backgroundColor: '#FF9500' }} />
                <div style={{ flex: 1, backgroundColor: '#FFD700' }} />
                <div style={{ flex: 1, backgroundColor: '#B8860B' }} />
            </div>

            <div style={{ padding: 24, backgroundColor: '#FFF8EE' }}>
                <p style={{ color: '#3D2B1F' }}>Hi {customerName.split(' ')[0]},</p>
                <p style={{ color: '#3D2B1F' }}>Your parasailing adventure on Flathead Lake is confirmed! Here are your details:</p>

                <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, margin: '16px 0', border: '1px solid #FFD700' }}>
                    <h3 style={{ marginTop: 0, color: '#B8860B' }}>Trip Details</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '6px 0', color: '#B8860B' }}>Date</td>
                                <td style={{ padding: '6px 0', fontWeight: 'bold', textAlign: 'right', color: '#3D2B1F' }}>{displayDate}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '6px 0', color: '#B8860B' }}>Time</td>
                                <td style={{ padding: '6px 0', fontWeight: 'bold', textAlign: 'right', color: '#3D2B1F' }}>{displayTime} (Mountain)</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '6px 0', color: '#B8860B' }}>Group Size</td>
                                <td style={{ padding: '6px 0', fontWeight: 'bold', textAlign: 'right', color: '#3D2B1F' }}>{partySize} {partySize === 1 ? 'person' : 'people'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, margin: '16px 0', border: '1px solid #FFD700' }}>
                    <h3 style={{ marginTop: 0, color: '#B8860B' }}>Itemized Receipt</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            {(addOns?.photo_package || 0) > 0 && (
                                <tr>
                                    <td style={{ padding: '6px 0', color: '#B8860B' }}>HD Photo Package x {addOns!.photo_package}</td>
                                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600, color: '#3D2B1F' }}>${photoTotal.toFixed(2)}</td>
                                </tr>
                            )}
                            {(addOns?.gopro_package || 0) > 0 && (
                                <tr>
                                    <td style={{ padding: '6px 0', color: '#B8860B' }}>GoPro Rental x {addOns!.gopro_package}</td>
                                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600, color: '#3D2B1F' }}>${goproTotal.toFixed(2)}</td>
                                </tr>
                            )}
                            {tipTotal > 0 && (
                                <tr>
                                    <td style={{ padding: '6px 0', color: '#3B6BA5' }}>Crew Gratuity</td>
                                    <td style={{ padding: '6px 0', textAlign: 'right', color: '#3B6BA5', fontWeight: 600 }}>${tipTotal.toFixed(2)}</td>
                                </tr>
                            )}
                            <tr style={{ borderTop: '2px solid #FFD700' }}>
                                <td style={{ padding: '12px 0 0', fontWeight: 'bold', fontSize: 16, color: '#3D2B1F' }}>Total Paid</td>
                                <td style={{ padding: '12px 0 0', textAlign: 'right', fontWeight: 'bold', fontSize: 18, color: '#FF9500' }}>${totalAmount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ margin: '16px 0' }}>
                    <h3 style={{ color: '#B8860B' }}>Location</h3>
                    <p style={{ margin: '4px 0', color: '#3D2B1F' }}>
                        <strong>Flathead Harbor Marina</strong><br />
                        Lakeside, MT
                    </p>
                    <p style={{ fontSize: 13, color: '#FF9500', fontWeight: 600 }}>Please arrive 15 minutes before departure.</p>
                </div>

                <p style={{ fontSize: 13, color: '#B8860B', fontStyle: 'italic' }}>
                    This email confirmation is NOT required to board the boat. We have your name on the manifest.
                </p>

                <p style={{ color: '#3D2B1F' }}>
                    Questions? Contact us at <a href="mailto:bigskyparasailing@gmail.com" style={{ color: '#FF9500' }}>bigskyparasailing@gmail.com</a> or call <a href="tel:4062706256" style={{ color: '#FF9500' }}>(406) 270-6256</a>.
                </p>

                <p style={{ color: '#3D2B1F' }}>See you on the water!</p>
                <p style={{ fontSize: 12, color: '#B8860B' }}>Big Sky Parasail LLC</p>
            </div>

            {/* Bottom retro stripe */}
            <div style={{ display: 'flex', height: 6, borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
                <div style={{ flex: 1, backgroundColor: '#FF9500' }} />
                <div style={{ flex: 1, backgroundColor: '#FFD700' }} />
                <div style={{ flex: 1, backgroundColor: '#B8860B' }} />
            </div>
        </div>
    );
};
