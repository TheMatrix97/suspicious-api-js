const { v4: uuidv4 } = require('uuid');
const { ec2Client, RunInstancesCommand, TerminateInstancesCommand } = require("../libs/ec2Client");
const { s3Client, CreateBucketCommand, PutObjectCommand, DeleteObjectCommand, DeleteBucketCommand, PutBucketTaggingCommand} = require("../libs/s3Client");

const nameBucket = "random-val-"+uuidv4();
let instanceId = "";

class CoolController {
    constructor(){}

    doFunnyThings(){
        this.something();
        this.anotherThing();
    }

    async something(){
        const commandCreate = new CreateBucketCommand({
            // The name of the bucket. Bucket names are unique and have several other constraints.
            // See https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
            Bucket: nameBucket,
        });
        const tagBucketCommand = new PutBucketTaggingCommand({
            Bucket: nameBucket,
            Tagging: { TagSet: [{ Key: "lab", Value: "cloudtrail"},] }
          });

        const commandAddFile = new PutObjectCommand({
            Bucket: nameBucket,
            Key: "readme.txt",
            Body: "PWNED?",
          });
        
        try {
            const { Location } = await s3Client.send(commandCreate);
            let response = await s3Client.send(tagBucketCommand);
            response = await s3Client.send(commandAddFile);
            console.log('action1 performed');
        } catch (err) {
            console.error(err);
        }
    }

    async anotherThing(){
        const command = new RunInstancesCommand({
            // An x86_64 compatible image.
            ImageId: process.env.AMI ?? "ami-005f9685cb30f234b",
            // An x86_64 compatible free-tier instance type.
            InstanceType: "t3.micro",
            // Ensure only 1 instance launches.
            MinCount: 1,
            MaxCount: 1,
            TagSpecifications: [{
                ResourceType: "instance",
                Tags: [
                    {Key: "Name",Value: "crypto-miner"},
                    {Key: "lab", Value: "cloudtrail"}
                ]
            }]
        });
        try {
            const response = await ec2Client.send(command);
            console.log('action2 performed');
            instanceId = response.Instances[0].InstanceId;
        } catch (err) {
            console.error(err);
        }
    }

    async cleanTheMess(){
        //s3
        const commandRemoveFile = new DeleteObjectCommand({
            Bucket: nameBucket,
            Key: "readme.txt",
        });
        const commandDeleteBucket = new DeleteBucketCommand({
            Bucket: nameBucket,
        });
        //ec2
        const commandTerminateInstance = new TerminateInstancesCommand({
            InstanceIds: [instanceId],
        });
        try {
            let response = await s3Client.send(commandRemoveFile);
            console.log("Cleaned file");
            response = await s3Client.send(commandDeleteBucket);
            console.log("Cleaned Bucket");
            response = await ec2Client.send(commandTerminateInstance);
            console.log("Cleaned Instance");
            return true;
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = {CoolController};
