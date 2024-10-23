import { ProjectData } from '../src/index';
import { zodToJsonSchema } from "zod-to-json-schema";
// @ts-ignore
import { writeFileSync } from 'node:fs';

const jsonSchema = zodToJsonSchema(ProjectData, "echo");
writeFileSync("./src/json-schema.json", JSON.stringify(jsonSchema, null, 2), { encoding: 'utf8' });
console.log('Done');