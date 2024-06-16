import { DYNAMO_DB_ACCESS_KEY, DYNAMO_DB_SECRET_KEY } from "$env/static/private";
import { AttributeValue, DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";

class DynamoDBService {
  private _client: DynamoDBClient;
  private _tableName = 'PushSubscriptions';
  private _partition = 'peru';
  
  constructor() {
    this._client = new DynamoDBClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: DYNAMO_DB_ACCESS_KEY,
        secretAccessKey: DYNAMO_DB_SECRET_KEY,
      },
    });
  }

  async createSubscription(name: string, userAgent: string, subscription: Record<string, AttributeValue>) {
    try {
      const data = await this._client.send(
        new PutItemCommand({
          TableName: this._tableName,
          Item: {
            partition: {
              S: this._partition,
            },
            name: {
              S: name,
            },
            userAgent: {
              S: userAgent,
            },
            subscription: {
              M: subscription,
            },
          },
        })
      );
      console.log('item successfully added to dynamo DB: ', data);
    } catch (error) {
      console.log('createSubscription: ', error);
    }
  }

  async getAllSubscriptions() {
    try {
      const items = await this._client.send(
        new ScanCommand({
          TableName: this._tableName,
        })
      );
      return items.Items ?? [];
    } catch (error) {
      console.log('getAllSubscriptions: ', error);
      return [];
    }
  }

  async exists(name: string) {
    try {
      const data = await this._client.send(
        new GetItemCommand({
          TableName: this._tableName,
          Key: {
            partition: {
              S: this._partition,
            },
            name: {
              S: name,
            },
          }
        })
      );
      
      if (data.Item) {
        console.log('found item: ', data.Item);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('exists error :', error);
      throw error;
    }
  }

  async delete(name: string) {
    try {
      const deleteCommandOutput = await this._client.send(
        new DeleteItemCommand({
          TableName: this._tableName,
          Key: {
            partition: {
              S: this._partition,
            },
            name: {
              S: name,
            }
          },
        })
      );
      console.log(`successfully deleted ${name}: `, deleteCommandOutput);
    } catch (error) {
      console.log('delete: ', error);
      throw error;
    }
  }
}

export default new DynamoDBService();
