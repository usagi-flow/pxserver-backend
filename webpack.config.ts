import * as path from "path";
import WebpackHelper from "./webpack.helper";
import * as webpack from "webpack";

const externals = require("webpack-node-externals");

export class WebpackConfiguration
{
	protected readonly libOutputDirectory : string = "lib";
	protected readonly appOutputDirectory : string = "dist";

	protected application : boolean = true;

	public setLibrary() : WebpackConfiguration
	{
		this.application = false;
		return this;
	}

	public isLibrary() : boolean
	{
		return !this.application;
	}

	public setApplication() : WebpackConfiguration
	{
		this.application = true;
		return this;
	}

	public isApplication() : boolean
	{
		return this.application;
	}

	public getOutputDirectory() : string
	{
		return this.application ? this.appOutputDirectory : this.libOutputDirectory;
	}

	public getServerEntry() : webpack.Entry
	{
		let entry : webpack.Entry = {};

		if (this.isApplication())
			entry["Server"] = WebpackHelper.getPath("./server/main.ts");
		else
			entry["Server"] = WebpackHelper.getPath("./server/module.ts");

		return entry;
	}

	protected getServerOutput() : webpack.Output
	{
		let output : webpack.Output = {};

		output.path = path.resolve(".", this.getOutputDirectory());

		if (this.isApplication())
		{
			output.filename = "main.js";
			output.library = "main";
			output.libraryTarget = "umd";
		}
		else
		{
			output.filename = "module.js";
			output.library = "module";
			output.libraryTarget = "umd";
		}

		return output;
	}

	public getServerConfig() : webpack.Configuration
	{
		return {
			target: "node",
			mode: "development",
			devtool: "inline-source-map",
			entry: this.getServerEntry(),
			module: {
				rules: [
					{
						test: /\.tsx?$/,
						loaders: [
							{
								loader: "ts-loader",
								options: { configFile: "tsconfig.server.json" }
							}
						],
						exclude: /node_modules/
					}
				]
			},
			resolve: {
				extensions: [".tsx", ".ts", ".js"],
				alias: {
					"hiredis": path.resolve(__dirname, "server", "helpers", "hiredis.js")
				}
			},
			output: this.getServerOutput(),
			node: {
				// Do not let Webpack change these globals
				__dirname: false,
				__filename: false,
			},
			externals: [externals()]
		};
	}

	public get() : webpack.Configuration[]
	{
		return [this.getServerConfig()];
	}
}

export default new WebpackConfiguration().setLibrary().get();