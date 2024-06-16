import { PUSH_NOTIFICATIONS_PRIVATE_KEY, PUSH_NOTIFICATIONS_PUBLIC_KEY } from '$env/static/private';
import DynamoDBService from '$lib/services/DynamoDBService.js';
import { json } from '@sveltejs/kit';
import webPush from 'web-push';
import { unmarshall } from "@aws-sdk/util-dynamodb";

// TODO: move to hooks to initialize only once
webPush.setVapidDetails(
  'mailto:gabrielsr10@gmail.com',
  PUSH_NOTIFICATIONS_PUBLIC_KEY,
  PUSH_NOTIFICATIONS_PRIVATE_KEY,
);

export async function POST({ request }) {
  try {
    const pushOptions = await request.json();

    const allSubscriptions = await DynamoDBService.getAllSubscriptions();

    const notificationPromises = allSubscriptions.map((subscription) => {
      console.log(unmarshall(subscription));
      return webPush.sendNotification(
        unmarshall(subscription).subscription,
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
