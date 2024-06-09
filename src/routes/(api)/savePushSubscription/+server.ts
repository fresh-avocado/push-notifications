import { PUSH_NOTIFICATIONS_PRIVATE_KEY, PUSH_NOTIFICATIONS_PUBLIC_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { appendFile } from 'fs/promises';
import webPush from 'web-push';

// TODO: move to a hook
webPush.setVapidDetails(
  'mailto:gabrielsr10@gmail.com',
  PUSH_NOTIFICATIONS_PUBLIC_KEY,
  PUSH_NOTIFICATIONS_PRIVATE_KEY,
);

export async function POST({ request }) {
  try {
    const pushSubscription = await request.json();

    console.log('saving push subscription: ', pushSubscription);

    await appendFile('./subscriptions.txt', JSON.stringify(pushSubscription) + '\n');  

    return json({ success: true });
  } catch (error) {
    console.log(error);
    return json({ success: false, message: (error as Error).message });
  }
}
