import { FileFormat } from "../constants/json.constants";

export const contentToJson = async (
  value: string,
  format = FileFormat.JSON
): Promise<object> => {
  let json: object = {};

  if (format === FileFormat.JSON) json = JSON.parse(value);

  if (!json) throw Error("Invalid JSON!");

  return Promise.resolve(json);
};

export const jsonToContent = async (
  json: object,
  format: FileFormat
): Promise<string> => {
  let contents: string = "";

  if (format === FileFormat.JSON) {
    contents = JSON.stringify(json, null, 2);
  }

  return Promise.resolve(contents);
};
