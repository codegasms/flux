export default function fromEnv(
  varName: string,
  defaultValue: string | null = null,
) {
  if (!process.env[varName] && defaultValue === null)
    throw new Error(
      `${varName}  is not provided in environment variables. Please set in .env file`,
    );
  return process.env[varName] || defaultValue;
}
