import { PUSH_NOTIFICATIONS_PRIVATE_KEY, PUSH_NOTIFICATIONS_PUBLIC_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import webPush from 'web-push';

webPush.setVapidDetails(
  'mailto:gabrielsr10@gmail.com',
  PUSH_NOTIFICATIONS_PUBLIC_KEY,
  PUSH_NOTIFICATIONS_PRIVATE_KEY,
);

export async function POST({ request }) {
  try {
    const body = await request.json();

    await webPush.sendNotification(
      body.pushSubscription,
      JSON.stringify(body.pushOptions),
    );

    return json({ success: true });
  } catch (error) {
    console.log(error);
    return json({ success: false, message: (error as Error).message });
  }
}
