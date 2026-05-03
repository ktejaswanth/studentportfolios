'use server'

import { sendApprovalEmail } from '@/lib/mail';

export async function triggerApprovalEmail(email: string, name: string) {
  if (!email) return { success: false, error: 'Email is required' };
  return await sendApprovalEmail(email, name);
}
