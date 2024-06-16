import DynamoDBService from '$lib/services/DynamoDBService.js';
import { json } from '@sveltejs/kit';

export async function GET({ cookies }) {
  try {
    const name = cookies.get('name');

    if (!name) {
      return json({ success: false, message: `Cookie 'name' doesnt exist!` });
    }

    console.log('deleting push subscription for: ', name);

    const subscriptionExists = await DynamoDBService.exists(name);

    if (subscriptionExists) {
      await DynamoDBService.delete(name);
      cookies.delete('name', { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
      return json({ success: true });
    } else {
      return json({ success: false, message: 'Subscription doesnt exist!' });
    }
  } catch (error) {
    console.log(error);
    return json({ success: false, message: (error as Error).message });
  }
}
