import { App, getStack } from "sst/constructs";
import { initProject } from "sst/project";
import { it } from "vitest";
import { StorageStack } from "../StorageStack";
import { Template } from "aws-cdk-lib/assertions";

it("Test Storage Stack", async () => {
  await initProject({});
  const app = new App({ mode: "deploy" });
  // WHEN
  app.stack(StorageStack);
  const template = Template.fromStack(getStack(StorageStack));
  template.hasResourceProperties("AWS::DynamoDB::Table", {
    BillingMode: "PAY_PER_REQUEST"
  });
})