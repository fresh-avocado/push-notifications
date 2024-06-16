import DynamoDBService from "$lib/services/DynamoDBService";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { json } from "@sveltejs/kit";

export async function GET() {
  const subscriptions = await DynamoDBService.getAllSubscriptions();

  const jsonSubscriptions = subscriptions.map((subscription) => unmarshall(subscription));

  return json(jsonSubscriptions);
}