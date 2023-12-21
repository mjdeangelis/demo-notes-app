import dynamodb from "@notes/core/dynamodb";
import handler from "@notes/core/handler";
import { Table } from "sst/node/table";

export const main = handler(async (event) => {
  const params = {
    TableName: Table.Notes.tableName,
    Key: {
      userId: "123",
      noteId: event?.pathParameters?.id
    }
  }

  await dynamodb.delete(params);

  return JSON.stringify({ status: true });
})