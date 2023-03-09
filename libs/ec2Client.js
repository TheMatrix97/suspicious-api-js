const {EC2Client, RunInstancesCommand, TerminateInstancesCommand} = require("@aws-sdk/client-ec2");
const REGION = "us-east-1";
const ec2Client = new EC2Client({ region: REGION });
module.exports = { ec2Client, RunInstancesCommand, TerminateInstancesCommand };