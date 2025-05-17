#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { JobTrackerStack } from '../lib/job-tracker-stack.js';

const app = new cdk.App();
new JobTrackerStack(app, 'JobTrackerStack');
