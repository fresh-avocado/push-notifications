import { PUSH_NOTIFICATIONS_PRIVATE_KEY, PUSH_NOTIFICATIONS_PUBLIC_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import webPush from 'web-push';
import { readFile } from 'fs/promises';

webPush.setVapidDetails(
  'mailto:gabrielsr10@gmail.com',
  PUSH_NOTIFICATIONS_PUBLIC_KEY,
  PUSH_NOTIFICATIONS_PRIVATE_KEY,
);

export async function POST({ request }) {
  try {
    const pushOptions = await request.json();
  
    const fileBuffer = await readFile('./subscriptions.txt');
    const fileString = fileBuffer.toString();
    const lines = fileString.split('\n');
    const cleanLines = lines.filter((line) => line.length > 0);

    const notificationPromises = cleanLines.map((line) => {
      return webPush.sendNotification(
        JSON.parse(line),
        JSON.stringify(pushOptions),
      );
    });

    await Promise.all(notificationPromises);

    return json({ success: true });
  } catch (error) {
    console.log(error);
    return json({ success: false, message: (error as Error).message });
  }
}
