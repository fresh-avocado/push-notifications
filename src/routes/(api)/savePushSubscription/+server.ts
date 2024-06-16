import { PUSH_NOTIFICATIONS_PRIVATE_KEY, PUSH_NOTIFICATIONS_PUBLIC_KEY } from '$env/static/private';
import DynamoDBService from '$lib/services/DynamoDBService.js';
import { marshall } from '@aws-sdk/util-dynamodb';
import { json } from '@sveltejs/kit';
import webPush from 'web-push';

// TODO: move to a hook
webPush.setVapidDetails(
  'mailto:gabrielsr10@gmail.com',
  PUSH_NOTIFICATIONS_PUBLIC_KEY,
  PUSH_NOTIFICATIONS_PRIVATE_KEY,
);

export async function POST({ request, cookies }) {
  try {
    const reqBody = await request.json();

    const userAgent = request.headers.get('user-agent') ?? '';

    console.log('saving push subscription: ', reqBody);

    const subscriptionExists = await DynamoDBService.exists(reqBody.name);

    if (subscriptionExists) {
      return json({ success: false, message: 'Subscription already exists!' });
    }

    await DynamoDBService.createSubscription(reqBody.name, userAgent, marshall(reqBody.subscription));

    cookies.set('name', reqBody.name, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });

    return json({ success: true });
  } catch (error) {
    console.log(error);
    return json({ success: false, message: (error as Error).message });
  }
}
