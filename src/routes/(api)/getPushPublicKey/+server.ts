import { json } from '@sveltejs/kit';
import { PUSH_NOTIFICATIONS_PRIVATE_KEY, PUSH_NOTIFICATIONS_PUBLIC_KEY } from '$env/static/private';
import webPush from 'web-push';

webPush.setVapidDetails(
  'mailto:gabrielsr10@gmail.com',
  PUSH_NOTIFICATIONS_PUBLIC_KEY,
  PUSH_NOTIFICATIONS_PRIVATE_KEY,
);

export async function GET() {
  return json({ publicKey: PUSH_NOTIFICATIONS_PUBLIC_KEY });
}
