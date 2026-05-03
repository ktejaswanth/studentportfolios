import { Resend } from 'resend';



export async function sendApprovalEmail(to: string, name: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolia <onboarding@resend.dev>',
      to: [to],
      subject: '🔥 Your Premium Pro Status is Active!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 20px; border: 1px solid #262626;">
          <h1 style="color: #E53935; font-size: 32px; margin-bottom: 20px;">Congratulations ${name}!</h1>
          <p style="font-size: 18px; line-height: 1.6; color: #a1a1a1;">Your payment has been verified and your <b>Premium Pro</b> account is now active.</p>
          
          <div style="background-color: #1f1f1f; padding: 20px; border-radius: 12px; margin: 30px 0;">
            <p style="margin: 0; font-weight: bold; color: #ffffff;">Subscription Details:</p>
            <ul style="color: #a1a1a1; padding-left: 20px;">
              <li>Plan: Premium Pro</li>
              <li>Duration: 120 Days</li>
              <li>Status: Active ✅</li>
            </ul>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: #a1a1a1;">You now have full access to all premium templates, advanced analytics, and custom branding features. Stand out professionally and land your dream job!</p>
          
          <div style="text-align: center; margin-top: 40px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://portfolia.vercel.app'}/dashboard" style="background-color: #E53935; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">Go to Dashboard</a>
          </div>
          
          <p style="margin-top: 40px; font-size: 12px; color: #555; text-align: center;">© 2026 Portfolia Inc. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email Exception:', error);
    return { success: false, error };
  }
}

export async function sendRenewalReminderEmail(to: string, name: string, expiryDate: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolia <onboarding@resend.dev>',
      to: [to],
      subject: '⏰ Action Required: Your Premium Subscription is Expiring Soon',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 20px; border: 1px solid #262626;">
          <h1 style="color: #E53935; font-size: 28px; margin-bottom: 20px;">Hello ${name},</h1>
          <p style="font-size: 18px; line-height: 1.6; color: #a1a1a1;">Your <b>Premium Pro</b> subscription is set to expire on <b>${new Date(expiryDate).toLocaleDateString()}</b>.</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #a1a1a1;">To keep your premium templates active and maintain access to your advanced features, please renew your subscription before it expires.</p>

          <div style="background-color: #1f1f1f; padding: 20px; border-radius: 12px; margin: 30px 0;">
            <p style="margin: 0; font-weight: bold; color: #ffffff;">Renewal Price:</p>
            <p style="font-size: 24px; color: #E53935; font-weight: bold; margin: 10px 0;">₹10 / 120 Days</p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: #a1a1a1;">Don't let your professional presence fade. Renew now to stay at the top of your game!</p>
          
          <div style="text-align: center; margin-top: 40px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://portfolia.vercel.app'}/pricing" style="background-color: #E53935; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">Renew Now</a>
          </div>
          
          <p style="margin-top: 40px; font-size: 12px; color: #555; text-align: center;">© 2026 Portfolia Inc. If you've already renewed, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email Exception:', error);
    return { success: false, error };
  }
}
