import core from "pxserver-core";

export default class ServerStarter extends core.AbstractServerStarter
{
	protected constructor(root? : string)
	{
		super(root);
	}

	protected start() : ServerStarter
	{
		console.warn("No server implementation");

		return this;
	}

	public static start(root? : string) : ServerStarter
	{
		let starter : ServerStarter = new ServerStarter(root);

		starter.start();

		return starter;
	}
}