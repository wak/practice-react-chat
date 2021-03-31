import os
import json
import datetime
import boto3
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):
    if event['httpMethod'] == 'GET':
        response = read(event['body'])
    elif event['httpMethod'] == 'POST':
        response = publish(event['body'])
    else:
        response = make_response(404, "invalid request")

    response["headers"] = { "Access-Control-Allow-Origin": "*" }
    return response

def make_response(code, message):
    return {
        "statusCode": code,
        "body": json.dumps({ 'message': message }),
    }

def read(body):
    dynamodb = boto3.resource('dynamodb', region_name = 'ap-northeast-1')
    table = dynamodb.Table(os.environ['CHAT_TABLE_NAME'])

    response = table.query(
        Limit=20,
        KeyConditionExpression=Key('room_id').eq('1'),
        ScanIndexForward=False
    )
    return {
        "statusCode": 200,
        "body": json.dumps(response['Items'])
    }

def publish(body):
    try:
        obj = json.loads(body)
    except:
        return make_response(400, 'Invalid Request')

    item = {
        'room_id': "1",
        'timestamp': datetime.datetime.now().isoformat(),
        'message': obj['message']
    }
    dynamodb = boto3.resource('dynamodb', region_name = 'ap-northeast-1')
    table = dynamodb.Table(os.environ['CHAT_TABLE_NAME'])
    table.put_item(Item=item)

    return make_response(200, "OK")
