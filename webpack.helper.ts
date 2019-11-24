import * as fs from "fs";
import * as path from "path";

export default class WebpackHelper
{
	/**
	 * Returns the given relative path to an existing file in the application directory,
	 * or falls back to a path to the same file in the library.
	 */
	public static getPath(relativePath : string) : string
	{
		if (fs.existsSync(relativePath))
			return relativePath;
		else
			return this.getLibraryPath(relativePath);
	}

	/**
	 * Returns the absolte path to the file in the library, specified by the given relative path.
	 */
	public static getLibraryPath(relativePath : string) : string
	{
		return path.resolve(__dirname, relativePath);
	}
}