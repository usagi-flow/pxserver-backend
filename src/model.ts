import * as fs from "fs";

export default class Model
{
	private configuration : AppConfiguration;

	public constructor()
	{
		this.loadConfiguration();
	}

	protected loadConfiguration()
	{
		this.configuration = JSON.parse(fs.readFileSync("configuration.json", "utf8"));

		if (!this.configuration.fileDescription)
		{
			// Perform fallback handling here
		}

		console.log("- Description: " + this.configuration.fileDescription);
	}
}

class AppConfiguration
{
	public fileDescription : string;
}