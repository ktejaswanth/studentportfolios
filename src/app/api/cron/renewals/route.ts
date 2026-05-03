import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendRenewalReminderEmail } from '@/lib/mail';

export async function GET(request: Request) {
  // 1. Security Check (Optional: add a secret header)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    // 2. Find students whose subscription expires in the next 7 days
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const { data: nearingExpiry, error } = await supabase
      .from('students')
      .select('name, email, subscription_expiry')
      .eq('subscription_status', 'pro')
      .lte('subscription_expiry', sevenDaysFromNow.toISOString())
      .gt('subscription_expiry', today.toISOString());

    if (error) throw error;

    if (!nearingExpiry || nearingExpiry.length === 0) {
      return NextResponse.json({ message: 'No subscriptions nearing expiry.' });
    }

    // 3. Send emails
    const results = await Promise.all(
      nearingExpiry.map(async (student) => {
        if (student.email) {
          return await sendRenewalReminderEmail(student.email, student.name, student.subscription_expiry);
        }
        return { success: false, error: 'No email found' };
      })
    );

    return NextResponse.json({ 
      processed: nearingExpiry.length, 
      results 
    });

  } catch (error: any) {
    console.error('Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
